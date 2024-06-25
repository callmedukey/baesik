"use client";
import { parseKoreanMealType } from "@/lib/parseKoreanMealType";
import type { Meals } from "@prisma/client";
import { format } from "date-fns";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { parseWeekDay } from "@/lib/parseWeekDay";
import CancelMealForm from "./CancelMealForm";

const CancelMealContainer = ({ meals }: { meals: Meals[] }) => {
  const [selectedMeal, setSelectedMeal] = useState<Meals[]>([]);
  
  const [confirmedCancel, setConfirmedCancel] = useState<boolean>(false);

  const handleSelectMeal = (meal: Meals) => {
    setSelectedMeal((prev) => [...prev, meal]);
  };
  const handleCancelMeal = (meal: Meals) => {
    setSelectedMeal((prev) => prev.filter((m) => m.id !== meal.id));
  };
  return (
    <ul className="">
      {!confirmedCancel &&
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
      {confirmedCancel && <CancelMealForm selectedMeals={selectedMeal} />}
      <Button
        className="mt-2 w-full"
        variant={"secondary"}
        onClick={() => {
          setConfirmedCancel((prev) => !prev);
        }}
      >
        {!confirmedCancel ? "취소 신청" : "뒤로가기"}
      </Button>
    </ul>
  );
};

export default CancelMealContainer;
