"use server";

import prisma from "@/lib/prisma";

import type { DateRange } from "react-day-picker";
import { verifySession } from "./session";
import { redirect } from "next/navigation";

export const findStudentsWithMeals = async (date: DateRange) => {
  const { from, to } = date;
  if (!from || !to) return;

  const session = await verifySession();
  if (!session) {
    redirect("/login");
  }

  const students = await prisma.student.findMany({
    where: {
      schoolId: session.schoolId,
      meals: {
        some: {
          date: {
            gte: new Date(new Date(from).setHours(0, 0, 0, 0)),
            lte: new Date(new Date(to).setHours(23, 59, 59, 999)),
          },
          isCancelled: false,
          payments: {
            paid: true,
          },
        },
      },
    },
    include: {
      meals: {
        where: {
          date: {
            gte: new Date(new Date(from).setHours(0, 0, 0, 0)),
            lte: new Date(new Date(to).setHours(23, 59, 59, 999)),
          },
          isCancelled: false,
          payments: {
            paid: true,
          },
        },
      },
    },
  });

  return students;
};

export const findStudents = async () => {
  const session = await verifySession();
  if (!session) {
    redirect("/login");
  }

  const students = await prisma.student.findMany({
    where: {
      schoolId: session.schoolId,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return students;
};
