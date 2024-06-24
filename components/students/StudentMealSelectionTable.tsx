import type { MealType } from "@prisma/client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AvailableDay } from "./ReadyContainer";
import { format } from "date-fns";
import { useState } from "react";
import { Button } from "../ui/button";

const StudentMealSelectionTable = ({ meals }: { meals: AvailableDay[] }) => {
  const [selectedMeals, setSelectedMeals] = useState<
    { date: string; mealType: MealType }[]
  >([]);
  const selectAll = () => {
    const parseInput: { date: string; mealType: MealType }[] = [];
    meals.forEach((meal) => {
      if (meal.isLunch) {
        parseInput.push({ date: meal.date, mealType: "LUNCH" });
      }
      if (meal.isDinner) {
        parseInput.push({ date: meal.date, mealType: "DINNER" });
      }
    });
    setSelectedMeals(parseInput);
  };

  const resetAll = () => {
    setSelectedMeals([]);
  };
  return (
    <>
      <div className="flex items-center justify-center w-full gap-2">
        <Button
          type="button"
          className="mx-auto w-full bg-primary/60 text-white hover:bg-primary"
          onClick={selectAll}
        >
          전체 선택하기
        </Button>
        <Button
          type="button"
          className="mx-auto w-full bg-red-600 text-white hover:bg-red-600/80 disabled:bg-red-600/60"
          disabled={selectedMeals.length === 0}
          onClick={resetAll}
        >
          전체 삭제하기
        </Button>
      </div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow className="">
            <TableHead className="text-left">날짜</TableHead>
            <TableHead className="text-center">점심</TableHead>
            <TableHead className="text-center">저녁</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meals.map((meal) => (
            <TableRow key={meal.date + meal.isDinner + meal.isLunch}>
              <TableCell> {format(meal.date, "yyyy-MM-dd")}</TableCell>
              <TableCell
                className="text-center w-[100px]"
                onClick={() => {
                  if (
                    selectedMeals.some(
                      (m) => m.date === meal.date && m.mealType === "LUNCH"
                    )
                  ) {
                    setSelectedMeals(
                      selectedMeals.filter((m) => {
                        console.log(m.date, meal.date);
                        if (m.date === meal.date && m.mealType === "LUNCH") {
                          return false;
                        }
                        return true;
                      })
                    );
                  } else {
                    setSelectedMeals([
                      ...selectedMeals,
                      { date: meal.date, mealType: "LUNCH" },
                    ]);
                  }
                }}
              >
                {selectedMeals.some(
                  (m) => m.date === meal.date && m.mealType === "LUNCH"
                )
                  ? "선택"
                  : "미선택"}
              </TableCell>
              <TableCell
                className="text-center w-[100px]"
                onClick={() => {
                  if (
                    selectedMeals.some(
                      (m) => m.date === meal.date && m.mealType === "DINNER"
                    )
                  ) {
                    setSelectedMeals(
                      selectedMeals.filter((m) => {
                        console.log(m.date, meal.date);
                        if (m.date === meal.date && m.mealType === "DINNER") {
                          return false;
                        }
                        return true;
                      })
                    );
                  } else {
                    setSelectedMeals([
                      ...selectedMeals,
                      { date: meal.date, mealType: "DINNER" },
                    ]);
                  }
                }}
              >
                {selectedMeals.some(
                  (m) => m.date === meal.date && m.mealType === "DINNER"
                )
                  ? "선택"
                  : "미선택"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default StudentMealSelectionTable;
