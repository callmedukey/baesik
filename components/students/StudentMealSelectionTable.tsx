import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AvailableDay } from "./ReadyContainer";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { saveShoppingCart } from "@/actions/students";
import { useRouter } from "next/navigation";
import { parseMealSelectionOption } from "@/lib/parseMealSelectionOption";
import { cn } from "@/lib/utils";
import { parseWeekDay } from "@/lib/parseWeekDay";
import { Holidays } from "@prisma/client";
import { InfoCircledIcon } from "@radix-ui/react-icons";

const StudentMealSelectionTable = ({
  meals,
  holidayData,
  existingMealDates,
  isAdmin,
  studentId,
  customHolidays,
}: {
  meals: AvailableDay[];
  holidayData?: { [key: string]: string };
  existingMealDates: AvailableDay[];
  isAdmin?: boolean;
  studentId?: string;
  customHolidays: Holidays[];
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState<
    {
      date: string;
      mealType: "LUNCH" | "DINNER";
    }[]
  >([]);

  const selectAll = () => {
    const parseInput: { date: string; mealType: "LUNCH" | "DINNER" }[] = [];
    meals.forEach((meal) => {
      if (
        meal.isLunch &&
        !existingMealDates.some((m) => m.date === meal.date && m.isLunch)
      ) {
        parseInput.push({ date: meal.date, mealType: "LUNCH" });
      }
      if (
        meal.isDinner &&
        !existingMealDates.some((m) => m.date === meal.date && m.isDinner)
      ) {
        parseInput.push({ date: meal.date, mealType: "DINNER" });
      }
    });

    setSelectedMeals(parseInput);
  };

  const resetAll = () => {
    setSelectedMeals([]);
  };

  const storeToStorage = async () => {
    setLoading(true);
    const result = await saveShoppingCart(selectedMeals, studentId);
    if (result.error) {
      alert(result.error);
    }
    if (isAdmin) {
      alert(result?.message || "장바구니에 추가 완료");
      return router.push("/admin/dashboard/students");
    }
    if (result.redirectTo) {
      if (!isAdmin) {
        router.push(result.redirectTo);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    setSelectedMeals([]);
  }, [meals, existingMealDates]);
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
          전체 미선택하기
        </Button>
        <Button
          className="w-full col-span-2"
          onClick={storeToStorage}
          type="button"
          disabled={selectedMeals.length === 0 || loading}
        >
          {loading ? "로딩..." : "결제 페이지로 이동"}
        </Button>
      </div>
      <div className="my-6 p-4 bg-blue-50 border-l-4 border-primary rounded-r-lg flex items-center gap-3 shadow-sm">
        <InfoCircledIcon className="w-6 h-6 text-primary flex-shrink-0" />
        <p className="text-lg text-primary font-medium">
          <span className="font-semibold">안내:</span> 신청 가능한 날짜는 최소 2일 전부터입니다
        </p>
      </div>
      <Table>
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
                    holidayData: holidayData || {},
                    customHolidays: customHolidays,
                    date: meal.date,
                    mealType: "LUNCH",
                    existingMealDates: existingMealDates,
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
                      customHolidays: customHolidays,
                      holidayData: holidayData || {},
                      date: meal.date,
                      mealType: "LUNCH",
                      existingMealDates: existingMealDates,
                    }) === "선택불가" ||
                    parseMealSelectionOption({
                      condition: selectedMeals.some(
                        (m) =>
                          m.date.toString() === meal.date &&
                          m.mealType === "LUNCH"
                      ),
                      whenYes: "선택",
                      whenNo: "미선택",
                      customHolidays: customHolidays,
                      holidayData: holidayData || {},
                      date: meal.date,
                      mealType: "LUNCH",
                      existingMealDates: existingMealDates,
                    }) === "이미신청"
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
                      { date: meal.date, mealType: "LUNCH" },
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
                  customHolidays: customHolidays,
                  holidayData: holidayData || {},
                  date: meal.date,
                  mealType: "LUNCH",
                  existingMealDates: existingMealDates,
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
                    customHolidays: customHolidays,
                    holidayData: holidayData || {},
                    date: meal.date,
                    mealType: "DINNER",
                    existingMealDates: existingMealDates,
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
                      customHolidays: customHolidays,
                      holidayData: holidayData || {},
                      date: meal.date,
                      mealType: "DINNER",
                      existingMealDates: existingMealDates,
                    }) === "선택불가" ||
                    parseMealSelectionOption({
                      condition: selectedMeals.some(
                        (m) =>
                          m.date.toString() === meal.date &&
                          m.mealType === "DINNER"
                      ),
                      whenYes: "선택",
                      whenNo: "미선택",
                      customHolidays: customHolidays,
                      holidayData: holidayData || {},
                      date: meal.date,
                      mealType: "DINNER",
                      existingMealDates: existingMealDates,
                    }) === "이미신청"
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
                      { date: meal.date, mealType: "DINNER" },
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
                  holidayData: holidayData || {},
                  customHolidays: customHolidays,
                  date: meal.date,
                  mealType: "DINNER",
                  existingMealDates: existingMealDates,
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
