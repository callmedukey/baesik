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
import type { Meals, Payments } from "@prisma/client";
import { format, isSaturday } from "date-fns";
import { ko } from "date-fns/locale/ko";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";

type MealWithPayment = Meals & {
  payments: Payments | null;
};

const StudentMealHistory = ({
  meals,
  isAdmin,
}: {
  meals: MealWithPayment[];
  isAdmin: boolean;
}) => {
  const studentMeals = useMemo(() => {
    const mealObj: {
      [key: string]: {
        hasLunch?: {
          isCancelled: boolean;
          isPaid: boolean;
        };
        hasDinner?: {
          isCancelled: boolean;
          isPaid: boolean;
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
            isPaid: meal.payments?.paid ?? false,
          },
        };
      }

      if (meal.mealType === "DINNER") {
        mealObj[format(meal.date, "yyyy-MM-dd", { locale: ko })] = {
          ...mealObj[format(meal.date, "yyyy-MM-dd", { locale: ko })],
          hasDinner: {
            isCancelled: meal.isCancelled,
            isPaid: meal.payments?.paid ?? false,
          },
        };
      }
    });

    const values = Object.entries(mealObj)
      .map(([date, meal]) => ({
        date,
        hasLunch: meal.hasLunch,
        hasDinner: meal.hasDinner,
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
        {studentMeals.map((studentMeal) => (
          <TableRow key={studentMeal.date} className="divide-x text-center">
            <TableCell className="flex flex-col gap-0.5">
              <span>{studentMeal.date}</span>
              <span className="text-xs text-gray-600">
                {parseWeekDay(new Date(studentMeal.date))}
              </span>
            </TableCell>
            <TableCell>
              {studentMeal.hasLunch ? (
                <div className="flex flex-col items-center gap-1">
                  {studentMeal.hasLunch.isCancelled ? (
                    <Badge variant="destructive">취소됨</Badge>
                  ) : (
                    <Badge variant="default">신청됨</Badge>
                  )}
                  {isAdmin && (
                    <Badge variant={studentMeal.hasLunch.isPaid ? "default" : "secondary"}>
                      {studentMeal.hasLunch.isPaid ? "결제완료" : "미결제"}
                    </Badge>
                  )}
                </div>
              ) : (
                "X"
              )}
            </TableCell>
            <TableCell>
              {isSaturday(new Date(studentMeal.date)) ? (
                "X"
              ) : studentMeal.hasDinner ? (
                <div className="flex flex-col items-center gap-1">
                  {studentMeal.hasDinner.isCancelled ? (
                    <Badge variant="destructive">취소됨</Badge>
                  ) : (
                    <Badge variant="default">신청됨</Badge>
                  )}
                  {isAdmin && (
                    <Badge variant={studentMeal.hasDinner.isPaid ? "default" : "secondary"}>
                      {studentMeal.hasDinner.isPaid ? "결제완료" : "미결제"}
                    </Badge>
                  )}
                </div>
              ) : (
                "X"
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default StudentMealHistory;
