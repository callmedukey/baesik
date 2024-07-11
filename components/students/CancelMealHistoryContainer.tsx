"use client";
import { parseKoreanMealType } from "@/lib/parseKoreanMealType";
import type { Meals } from "@prisma/client";
import { format } from "date-fns";
import { parseWeekDay } from "@/lib/parseWeekDay";

const CancelMealHistoryContainer = ({ meals }: { meals: Meals[] }) => {
  return (
    <ul className="">
      {meals &&
        meals.length > 0 &&
        meals.map((meal) => (
          <li
            key={meal.id}
            className="flex justify-between items-center border-b-2 py-2"
          >
            <div className="flex flex-col">
              <div>{format(meal.date, "yyyy-MM-dd")}</div>
              <div className="text-gray-500 text-sm">
                {parseWeekDay(meal.date)}
              </div>
            </div>
            <div>{parseKoreanMealType(meal.mealType)}</div>
          </li>
        ))}
    </ul>
  );
};

export default CancelMealHistoryContainer;
