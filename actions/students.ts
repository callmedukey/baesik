"use server";

import prisma from "@/lib/prisma";
import path from "path";
import { existsSync } from "fs";
import { MealSchemaArraySchema } from "@/lib/definitions";
import { verifySession } from "./session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
          gte: new Date(fromDate),
          lte: new Date(toDate),
        },
      },
      orderBy: {
        date: "desc",
      },
    });

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
  return found.map((day) => day.date.toString());
};

export const saveShoppingCart = async (
  meals: z.infer<typeof MealSchemaArraySchema>
) => {
  const validatedMeals = MealSchemaArraySchema.safeParse(meals);
  if (!validatedMeals.success) {
    console.error(validatedMeals.error);
    return { error: "잘못된 요청입니다" };
  }
  const session = await verifySession();

  if (!session) {
    return { error: "로그인이 필요합니다" };
  }

  const created = await prisma.savedMeals.createMany({
    data: validatedMeals.data.map((meal) => ({
      date: meal.date,
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
      createdAt: "desc",
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
  const payments = await prisma.payments.findMany({
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
