"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Meals } from "@prisma/client";
import { format } from "date-fns";
import { ko } from "date-fns/locale/ko";
import { useMemo } from "react";

const StudentMealHistory = ({ meals }: { meals: Meals[] }) => {
  const studentMeals = useMemo(() => {
    const mealObj: {
      [key: string]: { hasLunch: boolean; hasDinner: boolean };
    } = {};

    meals.forEach((meal) => {
      if (meal.mealType === "LUNCH") {
        mealObj[format(meal.date, "yyyy-MM-dd", { locale: ko })] = {
          ...mealObj[format(meal.date, "yyyy-MM-dd", { locale: ko })],
          hasLunch: meal.mealType === "LUNCH",
        };
      }

      if (meal.mealType === "DINNER") {
        mealObj[format(meal.date, "yyyy-MM-dd", { locale: ko })] = {
          ...mealObj[format(meal.date, "yyyy-MM-dd", { locale: ko })],
          hasDinner: meal.mealType === "DINNER",
        };
      }
    });
    return Object.entries(mealObj)
      .map(([date, meal]) => ({
        date,
        hasLunch: meal.hasLunch,
        hasDinner: meal.hasDinner,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
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
            <TableCell className="">{studentMeal.date}</TableCell>
            <TableCell className="">
              {studentMeal.hasLunch ? "O" : "X"}
            </TableCell>
            <TableCell className="">
              {studentMeal.hasDinner ? "O" : "X"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default StudentMealHistory;
