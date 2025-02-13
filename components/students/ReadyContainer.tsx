"use client";
import { useState } from "react";
import { ko } from "date-fns/locale/ko";
import {
  addDays,
  addMonths,
  differenceInDays,
  format,
  isSaturday,
  isSunday,
  startOfMonth,
  endOfMonth,
  isAfter,
} from "date-fns";
import { Button } from "@/components/ui/button";

import StudentMealSelectionTable from "./StudentMealSelectionTable";
import { getAlreadyAppliedMealDays } from "@/actions/students";
import type { Holidays } from "@prisma/client";

export type AvailableDay = {
  date: string;
  isLunch: boolean;
  isDinner: boolean;
};

const ReadyContainer = ({
  holidayData,
  customHolidays,
  isAdmin,
  studentId,
}: {
  holidayData?: { [key: string]: string };
  isAdmin?: boolean;
  studentId?: string;
  customHolidays: Holidays[];
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [applyDates, setApplyDates] = useState<AvailableDay[]>([]);
  const [existingMealDates, setExistingMealDates] = useState<AvailableDay[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);

  // Get the current date and the next two months
  const today = new Date();
  const startDate = addDays(today, 1); // This will be the first available date
  const months = [
    today,
    addMonths(today, 1),
    addMonths(today, 2),
  ];

  const handleMonthSelect = async (date: Date) => {
    setIsLoading(true);
    setSelectedMonth(date);

    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    if (!holidayData) {
      alert("공휴일 조회에 실패 했습니다");
      setIsLoading(false);
      return;
    }

    const alreadyAppliedMealDays = await getAlreadyAppliedMealDays({
      fromDate: monthStart,
      toDate: monthEnd,
      studentId,
    });

    const days = differenceInDays(monthEnd, monthStart) + 1;

    const totalArrayOfDays = Array.from({ length: days }, (_, i) =>
      format(addDays(monthStart, i), "yyyy-MM-dd", { locale: ko })
    );

    const possibleDays: AvailableDay[] = [];

    totalArrayOfDays.forEach((date) => {
      const currentDate = new Date(date);
      
      // Skip if the date is before the startDate (unless admin)
      if (!isAdmin && !isAfter(currentDate, startDate)) {
        return;
      }

      if (isSunday(currentDate)) {
        return;
      }

      const isCustomHoliday = customHolidays.some(
        (holiday) => format(holiday.date, "yyyy-MM-dd", { locale: ko }) === date
      );
      if (isCustomHoliday) {
        return;
      }

      if (holidayData && holidayData[date]) {
        return;
      }

      if (isSaturday(currentDate)) {
        possibleDays.push({
          date: date,
          isLunch: true,
          isDinner: false,
        });
        return;
      }

      possibleDays.push({
        date: date,
        isLunch: true,
        isDinner: true,
      });
    });

    setApplyDates(possibleDays);
    setExistingMealDates(alreadyAppliedMealDays);
    setIsLoading(false);
  };

  return (
    <div className="w-full space-y-4">
      <h1 className="text-center text-2xl font-bold">식사 신청</h1>
      <div className="max-w-md w-full mx-auto space-y-4">
        <div className="flex justify-center gap-4">
          {months.map((month) => (
            <Button
              key={format(month, "M")}
              variant={selectedMonth && format(selectedMonth, "M") === format(month, "M") ? "default" : "outline"}
              onClick={() => handleMonthSelect(month)}
              disabled={isLoading}
              className="w-24"
            >
              {format(month, "M")}월
            </Button>
          ))}
        </div>
 
        {applyDates.length > 0 && (
          <StudentMealSelectionTable
            meals={applyDates}
            holidayData={holidayData}
            existingMealDates={existingMealDates}
            isAdmin={isAdmin}
            studentId={studentId}
            customHolidays={customHolidays}
          />
        )}
      </div>
    </div>
  );
};

export default ReadyContainer;




