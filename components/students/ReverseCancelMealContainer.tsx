"use client";
import { parseKoreanMealType } from "@/lib/parseKoreanMealType";
import type { Meals } from "@prisma/client";
import { format } from "date-fns";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { parseWeekDay } from "@/lib/parseWeekDay";
import { reverseMeal } from "@/actions/students";

const ReverseCancelMealContainer = ({ meals }: { meals: Meals[] }) => {
  const [selectedMeal, setSelectedMeal] = useState<Meals[]>([]);
  const [loading, setLoading] = useState(false);
  const handleSelectMeal = (meal: Meals) => {
    setSelectedMeal((prev) => [...prev, meal]);
  };
  const handleCancelMeal = (meal: Meals) => {
    setSelectedMeal((prev) => prev.filter((m) => m.id !== meal.id));
  };

  const confirmReverse = async () => {
    if (selectedMeal.length === 0) {
      alert("재신청할 식사가 없습니다");
      return;
    }
    if (!confirm("재신청하시겠습니까?")) return;
    setLoading(true);
    const response = await reverseMeal({ meals: selectedMeal });

    if (response?.message) {
      setLoading(false);
      setSelectedMeal([]);
      return alert(response.message);
    }

    if (response?.error) {
      setLoading(false);
      setSelectedMeal([]);
      alert(response.error);
    }
  };
  return (
    <ul className="">
      {meals.map((meal) => (
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
          <Button
            className={cn(
              selectedMeal.some((m) => m.id === meal.id) ? "bg-red-500" : ""
            )}
            variant={"outline"}
            onClick={() => {
              if (selectedMeal.some((m) => m.id === meal.id)) {
                handleCancelMeal(meal);
              } else {
                handleSelectMeal(meal);
              }
            }}
          >
            {selectedMeal.some((m) => m.id === meal.id) ? "취소" : "선택"}
          </Button>
        </li>
      ))}
      <li className="text-right pt-2">{selectedMeal.length}개 선택됨</li>
      <Button
        className="mt-2 w-full"
        variant={"secondary"}
        disabled={loading || selectedMeal.length === 0}
        onClick={async () => {
          await confirmReverse();
        }}
      >
        재신청
      </Button>
    </ul>
  );
};

export default ReverseCancelMealContainer;
