"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parseWeekDay } from "@/lib/parseWeekDay";

import type { Meals } from "@prisma/client";
import { format, isSaturday } from "date-fns";
import { ko } from "date-fns/locale/ko";
import { useMemo } from "react";

const StudentMealHistory = ({ meals }: { meals: Meals[] }) => {
  const studentMeals = useMemo(() => {
    const mealObj: {
      [key: string]: {
        hasLunch: {
          isCancelled: boolean;
        };
        hasDinner: {
          isCancelled: boolean;
        };
      };
    } = {};

    // console.log(
    //   meals
    //     .filter((meal) => meal.mealType === "LUNCH")
    //     .map((meal) => ({
    //       date: format(meal.date, "yyyy-MM-dd"),
    //       mealType: meal.mealType,
    //       isCancelled: meal.isCancelled,
    //     }))
    // );

    meals.forEach((meal) => {
      if (meal.mealType === "LUNCH") {
        mealObj[format(meal.date, "yyyy-MM-dd", { locale: ko })] = {
          ...mealObj[format(meal.date, "yyyy-MM-dd", { locale: ko })],
          hasLunch: {
            isCancelled: meal.isCancelled,
          },
        };
      }

      if (meal.mealType === "DINNER") {
        mealObj[format(meal.date, "yyyy-MM-dd", { locale: ko })] = {
          ...mealObj[format(meal.date, "yyyy-MM-dd", { locale: ko })],
          hasDinner: {
            isCancelled: meal.isCancelled,
          },
        };
      }
    });

    const values = Object.entries(mealObj)
      .map(([date, meal]) => ({
        date,
        hasLunch: meal.hasLunch && !meal.hasLunch.isCancelled,
        hasDinner: meal.hasDinner && !meal.hasDinner.isCancelled,
      }))
      .sort((a, b) => -a.date.localeCompare(b.date));
    console.log(values);
    return values;
  }, [meals]);

  return (
    <Table className="max-w-md w-full mx-auto border rounded-md">
      <TableHeader className="max-w-sm w-full">
        <TableRow className="divide-x text-center">
          <TableHead className="text-center">신청일</TableHead>
          <TableHead className="text-center">점심</TableHead>
          <TableHead className="text-center">저녁</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {studentMeals.map((studentMeal, index) => (
          <TableRow key={studentMeal.date} className="divide-x text-center">
            <TableCell className="flex flex-col gap-0.5">
              <span>{studentMeal.date}</span>
              <span className="text-xs text-gray-600">
                {parseWeekDay(new Date(studentMeal.date))}
              </span>
            </TableCell>
            <TableCell className="">
              {studentMeal.hasLunch ? "O" : "X"}
            </TableCell>
            <TableCell className="">
              {isSaturday(studentMeal.date)
                ? "X"
                : studentMeal.hasDinner
                ? "O"
                : "X"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default StudentMealHistory;
