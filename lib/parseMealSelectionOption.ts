import type { AvailableDay } from "@/components/students/ReadyContainer";
import type { MealType } from "@prisma/client";
import { format, isSaturday, isSunday } from "date-fns";

export function parseMealSelectionOption({
  condition,
  whenYes,
  whenNo,
  holidayData,
  date,
  mealType,
  existingMealDates,
}: {
  condition: boolean;
  whenYes: string;
  whenNo: string;
  holidayData: { [key: string]: string };
  date: string;
  mealType: MealType;
  existingMealDates: AvailableDay[];
}) {
  if (holidayData[format(date, "yyyy-MM-dd")]) {
    return "선택불가";
  }

  if (isSunday(date)) {
    return "선택불가";
  }

  if (isSaturday(date) && mealType === "DINNER") {
    return "선택불가";
  }

  if (
    existingMealDates.some(
      (meal) =>
        meal.date === format(date, "yyyy-MM-dd") &&
        meal.isLunch === (mealType === "LUNCH" ? true : false)
    )
  ) {
    return "이미신청";
  }
  if (
    existingMealDates.some(
      (meal) =>
        meal.date === format(date, "yyyy-MM-dd") &&
        meal.isDinner === (mealType === "DINNER" ? true : false)
    )
  ) {
    return "이미신청";
  }

  if (condition) {
    return whenYes;
  }

  return whenNo;
}
