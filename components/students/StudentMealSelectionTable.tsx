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
import { saveShoppingCart } from "@/actions/students";
import { useRouter } from "next/navigation";
import { MealSchema } from "@/lib/definitions";
import { z } from "zod";
import { parseMealSelectionOption } from "@/lib/parseMealSelectionOption";
import { cn } from "@/lib/utils";
import { parseWeekDay } from "@/lib/parseWeekDay";

const StudentMealSelectionTable = ({
  meals,
  holidayData,
}: {
  meals: AvailableDay[];
  holidayData: { [key: string]: string };
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState<
    z.infer<typeof MealSchema>[]
  >([]);
  const selectAll = () => {
    const parseInput: z.infer<typeof MealSchema>[] = [];
    meals.forEach((meal) => {
      if (meal.isLunch) {
        parseInput.push({ date: new Date(meal.date), mealType: "LUNCH" });
      }
      if (meal.isDinner) {
        parseInput.push({ date: new Date(meal.date), mealType: "DINNER" });
      }
    });
    setSelectedMeals(parseInput);
  };

  const resetAll = () => {
    setSelectedMeals([]);
  };

  const storeToStorage = async () => {
    setLoading(true);
    const result = await saveShoppingCart(selectedMeals);
    if (result.error) {
      alert(result.error);
    }
    if (result.redirectTo) {
      router.push(result.redirectTo);
    }
    setLoading(false);
  };
  return (
    <>
      <div className="grid grid-cols-2 w-full gap-2">
        <Button
          type="button"
          className="mx-auto w-full bg-primary/70 text-white hover:bg-primary"
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
        <Button
          className="w-full col-span-2"
          onClick={storeToStorage}
          type="button"
          disabled={selectedMeals.length === 0 || loading}
        >
          {loading ? "담는중..." : "장바구니 담기"}
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
              <TableCell className="flex flex-col">
                <div>{format(meal.date, "yyyy-MM-dd")}</div>
                <div className="text-sm text-gray-500">
                  {parseWeekDay(new Date(meal.date))}
                </div>
              </TableCell>
              <TableCell
                className={cn(
                  "text-center w-[100px]",
                  parseMealSelectionOption({
                    condition: selectedMeals.some(
                      (m) =>
                        m.date.toString() === meal.date &&
                        m.mealType === "LUNCH"
                    ),
                    whenYes: "선택",
                    whenNo: "미선택",
                    holidayData,
                    date: meal.date,
                    mealType: "LUNCH",
                  }) === "선택불가"
                    ? "text-gray-500 cursor-not-allowed"
                    : "cursor-pointer"
                )}
                onClick={() => {
                  if (
                    parseMealSelectionOption({
                      condition: selectedMeals.some(
                        (m) =>
                          m.date.toString() === meal.date &&
                          m.mealType === "LUNCH"
                      ),
                      whenYes: "선택",
                      whenNo: "미선택",
                      holidayData,
                      date: meal.date,
                      mealType: "LUNCH",
                    }) === "선택불가"
                  ) {
                    return;
                  }

                  if (
                    selectedMeals.some(
                      (m) =>
                        m.date.toString() === meal.date &&
                        m.mealType === "LUNCH"
                    )
                  ) {
                    setSelectedMeals(
                      selectedMeals.filter((m) => {
                        console.log(m.date, meal.date);
                        if (
                          m.date.toString() === meal.date &&
                          m.mealType === "LUNCH"
                        ) {
                          return false;
                        }
                        return true;
                      })
                    );
                  } else {
                    setSelectedMeals([
                      ...selectedMeals,
                      { date: new Date(meal.date), mealType: "LUNCH" },
                    ]);
                  }
                }}
              >
                {parseMealSelectionOption({
                  condition: selectedMeals.some(
                    (m) =>
                      m.date.toString() === meal.date && m.mealType === "LUNCH"
                  ),
                  whenYes: "선택",
                  whenNo: "미선택",
                  holidayData,
                  date: meal.date,
                  mealType: "LUNCH",
                })}
              </TableCell>
              <TableCell
                className={cn(
                  "text-center w-[100px]",
                  parseMealSelectionOption({
                    condition: selectedMeals.some(
                      (m) =>
                        m.date.toString() === meal.date &&
                        m.mealType === "DINNER"
                    ),
                    whenYes: "선택",
                    whenNo: "미선택",
                    holidayData,
                    date: meal.date,
                    mealType: "DINNER",
                  }) === "선택불가"
                    ? "text-gray-500 cursor-not-allowed"
                    : "cursor-pointer"
                )}
                onClick={() => {
                  if (
                    parseMealSelectionOption({
                      condition: selectedMeals.some(
                        (m) =>
                          m.date.toString() === meal.date &&
                          m.mealType === "DINNER"
                      ),
                      whenYes: "선택",
                      whenNo: "미선택",
                      holidayData,
                      date: meal.date,
                      mealType: "DINNER",
                    }) === "선택불가"
                  ) {
                    return;
                  }

                  if (
                    selectedMeals.some(
                      (m) =>
                        m.date.toString() === meal.date &&
                        m.mealType === "DINNER"
                    )
                  ) {
                    setSelectedMeals(
                      selectedMeals.filter((m) => {
                        console.log(m.date, meal.date);
                        if (
                          m.date.toString() === meal.date &&
                          m.mealType === "DINNER"
                        ) {
                          return false;
                        }
                        return true;
                      })
                    );
                  } else {
                    setSelectedMeals([
                      ...selectedMeals,
                      { date: new Date(meal.date), mealType: "DINNER" },
                    ]);
                  }
                }}
              >
                {parseMealSelectionOption({
                  condition: selectedMeals.some(
                    (m) =>
                      m.date.toString() === meal.date && m.mealType === "DINNER"
                  ),
                  whenYes: "선택",
                  whenNo: "미선택",
                  holidayData,
                  date: meal.date,
                  mealType: "DINNER",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default StudentMealSelectionTable;
