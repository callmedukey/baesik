"use server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { verifySession } from "./session";
import { redirect } from "next/navigation";
import {
  AddSchoolSchema,
  PaymentSearchSchema,
  RefundSearchSchema,
  StudentSearchSchema,
  UpdateStudentPasswordSchema,
  UpdateStudentSchema,
} from "@/lib/definitions";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { addDays } from "date-fns";
import type { DateRange } from "react-day-picker";

export const getSchools = async () => {
  try {
    const session = await verifySession();
    if (!session || !session.isAdmin) {
      return redirect("/admin");
    }

    const schools = await prisma.school.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });
    return schools;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getSchoolWithStudents = async (schoolId: string) => {
  const school = await prisma.school.findUnique({
    where: {
      id: schoolId,
    },
    include: {
      students: true,
    },
  });
  if (!school) {
    return redirect("/admin/dashboard/schools");
  }
  return school;
};

export const AddSchoolToList = async (
  data: z.infer<typeof AddSchoolSchema>
) => {
  try {
    const session = await verifySession();
    if (!session || !session.isAdmin) {
      return redirect("/admin");
    }

    const found = await prisma.school.findUnique({
      where: {
        name: data.name,
      },
    });

    if (found) {
      return {
        error: "이미 존재하는 학원입니다.",
      };
    }

    const school = await prisma.school.create({
      data: {
        name: data.name,
      },
    });

    if (school) {
      revalidatePath("/admin/dashboard/schools");
      revalidatePath("/login");
      revalidatePath("/signup");
      return {
        message: "학원를 성공적으로 추가했습니다",
      };
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteSchool = async (schoolId: string) => {
  try {
    const session = await verifySession();
    if (!session || !session.isAdmin) {
      return redirect("/admin");
    }

    const school = await prisma.school.delete({
      where: {
        id: schoolId,
      },
    });

    if (school) {
      revalidatePath("/admin/dashboard/schools");
      return {
        message: "학원를 명단에서 삭제했습니다",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      error: "삭제 오류로 실패했습니다.",
    };
  }
};

export const updateSchool = async (
  data: z.infer<typeof AddSchoolSchema> & { id: string }
) => {
  try {
    const session = await verifySession();
    if (!session || !session.isAdmin) {
      return redirect("/admin");
    }

    const school = await prisma.school.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
      },
    });

    if (school) {
      revalidatePath("/admin/dashboard/schools");
      return {
        message: "학원 정보를 성공적으로 업데이트했습니다",
      };
    } else {
      return {
        error: "업데이트 오류로 실패했습니다.",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      error: "업데이트 오류로 실패했습니다.",
    };
  }
};

export const getStudentsWithMeals = async ({
  schoolId,
  fromDate,
  toDate,
}: {
  schoolId: string;
  fromDate: Date;
  toDate: Date;
}) => {
  const students = await prisma.student.findMany({
    where: {
      schoolId,
      meals: {
        some: {
          date: {
            gte: new Date(new Date(fromDate).setHours(0, 0, 0, 0)),
            lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
          },
        },
      },
    },
    include: {
      meals: true,
    },
  });

  if (!students) {
    return null;
  }
  return students;
};

export const getSchoolsWithStudentsForMeals = async () => {
  const [todayRequests, tomorrowRequests] = await prisma.$transaction([
    prisma.school.findMany({
      where: {
        students: {
          some: {
            meals: {
              some: {
                date: {
                  gte: new Date(new Date().setHours(0, 0, 0, 0)),
                  lte: new Date(new Date().setHours(23, 59, 59, 999)),
                },
              },
            },
          },
        },
      },
      include: {
        students: {
          include: {
            meals: {
              where: {
                date: {
                  gte: new Date(new Date().setHours(0, 0, 0, 0)),
                  lte: new Date(new Date().setHours(23, 59, 59, 999)),
                },
              },
            },
          },
        },
      },
    }),
    prisma.school.findMany({
      where: {
        students: {
          some: {
            meals: {
              some: {
                date: {
                  gte: new Date(addDays(new Date(), 1).setHours(0, 0, 0, 0)),
                  lte: new Date(
                    addDays(new Date(), 1).setHours(23, 59, 59, 999)
                  ),
                },
              },
            },
          },
        },
      },
      include: {
        students: {
          include: {
            meals: {
              where: {
                date: {
                  gte: new Date(addDays(new Date(), 1).setHours(0, 0, 0, 0)),
                  lte: new Date(
                    addDays(new Date(), 1).setHours(23, 59, 59, 999)
                  ),
                },
              },
            },
          },
        },
      },
    }),
  ]);
  return { todayRequests, tomorrowRequests };
};

export const findPayment = async ({
  type,
  searchTerm,
  searchDate,
}: {
  type: z.infer<typeof PaymentSearchSchema>["type"];
  searchTerm: z.infer<typeof PaymentSearchSchema>["searchTerm"];
  searchDate: DateRange;
}) => {
  if (!searchDate || !searchDate.from || !searchDate.to) {
    return null;
  }

  if (type === "payer") {
    const payers = await prisma.payments.findMany({
      where: {
        payer: {
          contains: searchTerm,
        },
        createdAt: {
          gte: new Date(new Date(searchDate.from).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(searchDate.to).setHours(23, 59, 59, 999)),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return payers;
  }

  if (type === "school") {
    const schools = await prisma.payments.findMany({
      where: {
        schoolName: {
          contains: searchTerm,
        },
        createdAt: {
          gte: new Date(new Date(searchDate.from).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(searchDate.to).setHours(23, 59, 59, 999)),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return schools;
  }

  if (type === "student") {
    const students = await prisma.payments.findMany({
      where: {
        studentName: {
          contains: searchTerm,
        },
        createdAt: {
          gte: new Date(new Date(searchDate.from).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(searchDate.to).setHours(23, 59, 59, 999)),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return students;
  }

  return null;
};

export const getRefundRequests = async ({
  type,
  searchTerm,
  searchDate,
}: {
  type: z.infer<typeof RefundSearchSchema>["type"];
  searchTerm: z.infer<typeof RefundSearchSchema>["searchTerm"];
  searchDate: DateRange;
}) => {
  if (!searchDate || !searchDate.from || !searchDate.to) {
    return null;
  }

  switch (type) {
    case "accountHolder":
      return await prisma.refundRequest.findMany({
        where: {
          accountHolder: {
            contains: searchTerm,
          },
          createdAt: {
            gte: new Date(new Date(searchDate.from).setHours(0, 0, 0, 0)),
            lte: new Date(new Date(searchDate.to).setHours(23, 59, 59, 999)),
          },
        },
        include: {
          student: {
            include: {
              school: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    case "bank":
      return await prisma.refundRequest.findMany({
        where: {
          bankDetails: {
            contains: searchTerm,
          },
          createdAt: {
            gte: new Date(new Date(searchDate.from).setHours(0, 0, 0, 0)),
            lte: new Date(new Date(searchDate.to).setHours(23, 59, 59, 999)),
          },
        },
        include: {
          student: {
            include: {
              school: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    case "school":
      return await prisma.refundRequest.findMany({
        where: {
          student: {
            school: {
              name: {
                contains: searchTerm,
              },
            },
          },
          createdAt: {
            gte: new Date(new Date(searchDate.from).setHours(0, 0, 0, 0)),
            lte: new Date(new Date(searchDate.to).setHours(23, 59, 59, 999)),
          },
        },
        include: {
          student: {
            include: {
              school: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    case "student":
      return await prisma.refundRequest.findMany({
        where: {
          student: {
            name: {
              contains: searchTerm,
            },
          },
          createdAt: {
            gte: new Date(new Date(searchDate.from).setHours(0, 0, 0, 0)),
            lte: new Date(new Date(searchDate.to).setHours(23, 59, 59, 999)),
          },
        },
        include: {
          student: {
            include: {
              school: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    default:
      return null;
  }
};

export const confirmSingleRefund = async (refundRequestId: string) => {
  const refundRequest = await prisma.refundRequest.findUnique({
    where: {
      id: refundRequestId,
    },
    include: {
      cancelledMeals: true,
    },
  });

  if (!refundRequest) return null;

  const updated = await prisma.refundRequest.update({
    where: {
      id: refundRequestId,
    },
    data: {
      complete: true,
      cancelledMeals: {
        updateMany: {
          where: {
            studentId: refundRequest.studentId,
            id: {
              in: refundRequest.cancelledMeals.map((meal) => meal.id),
            },
          },
          data: {
            isCancelled: true,
          },
        },
      },
    },
  });

  if (updated) {
    revalidatePath("/admin/dashboard/refunds");
    return {
      message: "확불처리를 성공적으로 완료했습니다",
    };
  } else return { error: "확불처리를 실패했습니다" };
};

export const manualConfirmPayment = async (
  paymentId: string,
  bool: boolean
) => {
  const payment = await prisma.payments.update({
    where: {
      id: paymentId,
    },
    data: {
      paid: bool,
    },
  });

  revalidatePath("/students/payments");

  return payment;
};

export const confirmMeals = async (meals: { id: string }[]) => {
  const updated = await prisma.meals.updateMany({
    where: {
      id: {
        in: meals.map((meal) => meal.id),
      },
    },
    data: {
      isComplete: true,
    },
  });

  if (updated.count === meals.length) {
    revalidatePath("/admin/dashboard");
    return {
      message: "학식 확정을 성공적으로 완료했습니다",
    };
  } else return { error: "학식 확정을 실패했습니다" };
};

export const deletePayment = async (paymentId: string) => {
  const search = await prisma.payments.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      meals: true,
    },
  });

  //check if any meals had requested refunds
  const check = [];

  search?.meals.forEach((meal) => {
    if (meal.refundRequestId) {
      check.push(meal.refundRequestId);
    }
  });

  if (check.length > 0) {
    return {
      error: "환불 요청이 존재하는 결제는 삭제할 수 없습니다",
    };
  }

  const deleted = await prisma.payments.delete({
    where: {
      id: paymentId,
    },
  });

  if (deleted) {
    revalidatePath("/admin/dashboard/payments");
    revalidatePath("/student/payments");
    revalidatePath("/school/students");
    return {
      message: "결제를 성공적으로 삭제했습니다",
    };
  } else return { error: "결제를 삭제하지 못했습니다" };
};

export const findStudentsAsAdmin = async ({
  searchTerm,
  type,
}: {
  searchTerm: z.infer<typeof StudentSearchSchema>["searchTerm"];
  type: z.infer<typeof StudentSearchSchema>["type"];
}) => {
  switch (type) {
    case "username":
      const studentsWithUsername = await prisma.student.findMany({
        where: {
          username: {
            contains: searchTerm,
          },
        },
        include: {
          school: true,
        },
      });
      return studentsWithUsername;

    case "studentName":
      const studentsWithName = await prisma.student.findMany({
        where: {
          name: {
            contains: searchTerm,
          },
        },
        include: {
          school: true,
        },
      });
      return studentsWithName;

    case "studentEmail":
      const studentsWithEmail = await prisma.student.findMany({
        where: {
          email: {
            contains: searchTerm,
          },
        },
        include: {
          school: true,
        },
      });
      return studentsWithEmail;

    case "schoolName":
      const studentsWithSchoolName = await prisma.student.findMany({
        where: {
          school: {
            name: {
              contains: searchTerm,
            },
          },
        },
        include: {
          school: true,
        },
      });
      return studentsWithSchoolName;
    default:
      return [];
  }
};

export const adminFindSingleStudent = async (studentId: string) => {
  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
    include: {
      school: true,
    },
  });

  return student;
};

export const updateStudent = async (
  data: z.infer<typeof UpdateStudentSchema>
) => {
  const student = await prisma.student.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
      school: {
        connect: {
          name: data.schoolName,
        },
      },
    },
  });

  revalidatePath("/admin/dashboard/students");
  revalidatePath(`/admin/dashboard/students/${data.id}`);

  if (student) {
    return {
      message: "학생 정보 수정을 성공적으로 완료했습니다",
    };
  } else {
    return {
      error: "학생 정보 수정을 실패했습니다",
    };
  }
};

export const updateStudentPassword = async (
  data: z.infer<typeof UpdateStudentPasswordSchema>
) => {
  if (data.password !== data.confirmPassword) {
    return { error: "비밀번호가 일치하지 않습니다" };
  }

  const student = await prisma.student.update({
    where: {
      id: data.id,
    },
    data: {
      password: await bcrypt.hash(data.password, 10),
    },
  });

  revalidatePath("/admin/dashboard/students");
  revalidatePath(`/admin/dashboard/students/${data.id}`);

  if (student) {
    return {
      message: "비밀번호 변경을 성공적으로 완료했습니다",
    };
  } else {
    return {
      error: "비밀번호 변경을 실패했습니다",
    };
  }
};

export const findUnpaidPayment = async () => {
  const payments = await prisma.payments.findMany({
    where: {
      paid: false,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return payments;
};
