"use server";
import prisma from "@/lib/prisma";

export const getMealForDay = async (date: Date) => {
  try {
    const meals = await prisma.meals.findFirst({
      where: {
        date,
      },
    });

    if (!meals) return null;

    return meals;
  } catch (error) {
    console.log(error);
    return null;
  }
};
