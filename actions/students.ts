"use server";

import prisma from "@/lib/prisma";
import path from "path";
import { existsSync } from "fs";
import { verifySession } from "./session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addDays, format } from "date-fns";
import type { Meals } from "@prisma/client";

export const getMenu = async ({
  fromDate,
  toDate,
}: {
  fromDate: Date;
  toDate: Date;
}) => {
  try {
    if (!fromDate || !toDate) {
      return { error: "조회일이 모두 선택되어야 합니다" };
    }

    const found = await prisma.menu.findMany({
      where: {
        date: {
          gte: new Date(new Date(fromDate).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
        },
      },
      orderBy: {
        date: "desc",
      },
    });
    console.log(found);
    if (found.length === 0) {
      return { message: "해당 날짜에 메뉴가 없습니다", notReady: true };
    }
    const uniqueFileNames = Array.from(
      new Set(found.map((menu) => menu.fileName))
    ).filter((fileName) => typeof fileName === "string");

    const validFiles = [];
    if (uniqueFileNames.length > 0) {
      for (const fileName of uniqueFileNames) {
        if (existsSync(path.join(process.cwd(), "uploads") + "/" + fileName)) {
          validFiles.push(fileName);
        }
      }
    }
    return { validFiles, ready: true };
  } catch (error) {
    console.error(error);
    return { error: "파일을 찾을수 없습니다" };
  }
};

export const getMenuAvailableDays = async ({ days }: { days: Date[] }) => {
  const found = await prisma.menu.findMany({
    where: {
      date: {
        in: days,
      },
    },
    select: {
      date: true,
    },
  });
  return found.map((day) => format(new Date(day.date), "yyyy-MM-dd"));
};

export const saveShoppingCart = async (
  meals: { date: string; mealType: "LUNCH" | "DINNER" }[]
) => {
  const session = await verifySession();

  if (!session) {
    return { error: "로그인이 필요합니다" };
  }

  const created = await prisma.savedMeals.createMany({
    data: meals.map((meal) => ({
      date: new Date(meal.date),
      mealType: meal.mealType,
      studentId: session.userId,
    })),
  });
  revalidatePath("/student/cart");
  if (created && created.count === meals.length) {
    return {
      message: "장바구니에 추가되었습니다",
      redirectTo: "/student/cart",
    };
  }
  return { error: "장바구니에 추가되지 않았습니다" };
};

export const getShoppingCart = async () => {
  const session = await verifySession();
  if (!session) {
    return { error: "로그인이 필요합니다" };
  }
  const meals = await prisma.savedMeals.findMany({
    where: {
      studentId: session.userId,
    },
    orderBy: {
      date: "asc",
    },
  });

  return meals;
};

export const deleteSavedMeal = async (id: string) => {
  const deleted = await prisma.savedMeals.delete({
    where: {
      id,
    },
  });

  if (deleted) {
    revalidatePath("/student/cart");
    return { message: "장바구니에서 삭제되었습니다" };
  }
  return { error: "장바구니에서 삭제되지 않았습니다" };
};

export const getPaymentAmount = async (id: string) => {
  const payment = await prisma?.payments.findUnique({
    where: {
      id,
    },
    select: {
      amount: true,
    },
  });
  return payment;
};

export const getPayments = async () => {
  const session = await verifySession();
  const payments = await prisma.payments.findMany({
    where: {
      studentId: session?.userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          meals: true,
        },
      },
    },
  });

  return payments;
};

export const cancelPayment = async (id: string) => {
  const session = await verifySession();
  if (!session) {
    redirect("/login");
  }
  const deleted = await prisma.payments.delete({
    where: {
      id,
      studentId: session.userId,
    },
  });

  if (deleted) {
    revalidatePath("/student/payments");
    return true;
  } else false;
};

export const getCancelableMeals = async () => {
  const session = await verifySession();

  if (!session) {
    redirect("/login");
  }
  const meals = await prisma.meals.findMany({
    where: {
      isCancelled: false,
      isComplete: false,
      studentId: session?.userId,
      payments: {
        paid: true,
      },
      date: {
        gte: addDays(new Date(new Date().setHours(0, 0, 0, 0)), 2),
      },
      refundRequest: {
        complete: false,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  return meals;
};

export const cancelMeals = async ({
  meals,
  accountHolder,
  bankDetails,
}: {
  meals: Meals[];
  accountHolder: string;
  bankDetails: string;
}) => {
  const session = await verifySession();
  if (!session) {
    redirect("/login");
  }

  return await prisma.$transaction(async (tx) => {
    const createdRequest = await tx.refundRequest.create({
      data: {
        accountHolder,
        bankDetails,
        studentId: session.userId,
        amount: Math.floor(meals.reduce((acc, meal) => acc + 7000, 0)),
      },
    });
    const updated = await tx.meals.updateMany({
      where: {
        isComplete: false,
        isCancelled: false,
        studentId: session.userId,
        id: {
          in: meals.map((meal) => meal.id),
        },
      },
      data: {
        isCancelled: true,
        refundRequestId: createdRequest.id,
      },
    });
    revalidatePath("/student/cancelation");
    revalidatePath("/student/reverse-cancelation");
    if (updated && updated.count === meals.length) {
      return { message: "환불 신청되었습니다" };
    }
    return { error: "환불 신청되지 않았습니다" };
  });
};

export const getReversibleMeals = async () => {
  const session = await verifySession();
  if (!session) {
    redirect("/login");
  }

  return await prisma.meals.findMany({
    where: {
      isCancelled: true,
      isComplete: false,
      studentId: session.userId,
      payments: {
        paid: true,
      },
      refundRequest: {
        complete: false,
      },
      date: {
        gte: addDays(new Date(new Date().setHours(0, 0, 0, 0)), 1),
      },
    },
    orderBy: {
      date: "asc",
    },
  });
};

export const reverseMeal = async ({ meals }: { meals: Meals[] }) => {
  const session = await verifySession();
  if (!session) {
    redirect("/login");
  }

  const refundsObject: { [key: string]: number } = {};

  meals.forEach((meal) => {
    if (meal.refundRequestId) {
      if (refundsObject[meal.refundRequestId]) {
        refundsObject[meal.refundRequestId] += 7000;
      } else {
        refundsObject[meal.refundRequestId] = 7000;
      }
    }
  });

  const refundsObjectArray = Object.entries(refundsObject).map(
    ([key, value]) => ({
      id: key,
      amount: value,
    })
  );

  return await prisma.$transaction(async (tx) => {
    const updatedArray = [];
    //find the refundRequests and update refund amount
    refundsObjectArray.forEach(async (refund) => {
      const updated = await tx.refundRequest.update({
        where: {
          id: refund.id,
          complete: false,
        },
        data: {
          amount: {
            decrement: refund.amount,
          },
        },
      });
      updatedArray.push(updated.id);
    });

    //update the meals
    const updated = await tx.meals.updateMany({
      where: {
        isCancelled: true,
        isComplete: false,
        studentId: session.userId,
        id: {
          in: meals.map((meal) => meal.id),
        },
      },
      data: {
        isCancelled: false,
        refundRequestId: null,
      },
    });

    if (
      updated &&
      updated.count === meals.length &&
      updatedArray.length === refundsObjectArray.length
    ) {
      revalidatePath("/student/reverse-cancelation");
      revalidatePath("/student/cancelation");
      return { message: "재신청되었습니다" };
    }
    return { error: "재신청되지 않았습니다" };
  });
};
