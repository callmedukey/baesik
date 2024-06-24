import type { MealType } from "@prisma/client";
import { format, isSaturday, isSunday } from "date-fns";

export function parseMealSelectionOption({
  condition,
  whenYes,
  whenNo,
  holidayData,
  date,
  mealType,
}: {
  condition: boolean;
  whenYes: string;
  whenNo: string;
  holidayData: { [key: string]: string };
  date: string;
  mealType: MealType;
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

  if (condition) {
    return whenYes;
  }

  return whenNo;
}
