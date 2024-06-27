"use client";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { ko } from "date-fns/locale/ko";
import {
  addDays,
  differenceInDays,
  format,
  isSaturday,
  isSunday,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import StudentMealSelectionTable from "./StudentMealSelectionTable";
import { getMenuAvailableDays } from "@/actions/students";
import MonthlyMenuContainer from "./MonthlyMenuContainer";

export type AvailableDay = {
  date: string;
  isLunch: boolean;
  isDinner: boolean;
};

const ReadyContainer = ({
  holidayData,
}: {
  holidayData?: { [key: string]: string };
}) => {
  const [applicationDate, setApplicationDate] = useState<DateRange | undefined>(
    {
      from: undefined,
      to: undefined,
    }
  );

  const [isLoading, setIsLoading] = useState(false);
  const [applyDates, setApplyDates] = useState<AvailableDay[]>([]);

  const handleApply = async () => {
    setIsLoading(true);
    if (!holidayData) {
      alert("공휴일 조회에 실패 했습니다");
      setIsLoading(false);
    }

    if (!applicationDate || !applicationDate.from || !applicationDate.to) {
      alert("신청일을 선택해주세요.");
      setIsLoading(false);
      return;
    }
    if (applicationDate.from < new Date()) {
      alert("이미 지난 날짜입니다.");
      setApplicationDate({
        from: undefined,
        to: undefined,
      });
      setIsLoading(false);
      return;
    }

    const selectedFrom = format(applicationDate.from, "yyyy-MM-dd", {
      locale: ko,
    });

    if (selectedFrom <= "2024-06-30") {
      alert("신청 가능한 날짜는 2024년 7월 1일부터입니다.");
      setApplicationDate({
        from: undefined,
        to: undefined,
      });
      setApplyDates([]);
      setIsLoading(false);
      return;
    }

    const days = differenceInDays(applicationDate.to, applicationDate.from) + 1;

    const totalArrayOfDays = Array.from({ length: days }, (_, i) =>
      format(addDays(applicationDate.from as Date, i), "yyyy-MM-dd", {
        locale: ko,
      })
    );

    const possibleDays: AvailableDay[] = [];

    totalArrayOfDays.map((date) => {
      if (isSunday(date)) {
        return;
      }
      if (holidayData && (holidayData[date] || isSaturday(date))) {
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
    setIsLoading(false);
  };

  return (
    <div className="w-full space-y-4">
      <MonthlyMenuContainer />
      <div className="max-w-md w-full mx-auto space-y-4">
        <aside className="w-full flex gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !applicationDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {applicationDate?.from ? (
                  applicationDate.to ? (
                    <>
                      {format(applicationDate.from, "yyyy-MM-dd")} -{" "}
                      {format(applicationDate.to, "yyyy-MM-dd")}
                    </>
                  ) : (
                    format(applicationDate.from, "yyyy-MM-dd")
                  )
                ) : (
                  <span>날짜 선택</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                locale={ko}
                defaultMonth={applicationDate?.from}
                selected={applicationDate}
                onSelect={setApplicationDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button
            disabled={!applicationDate || isLoading}
            onClick={handleApply}
            type="button"
          >
            {isLoading ? "로딩중..." : "신청하기"}
          </Button>
        </aside>
        {applyDates.length > 0 && (
          <StudentMealSelectionTable
            meals={applyDates}
            holidayData={holidayData}
          />
        )}
      </div>
    </div>
  );
};

export default ReadyContainer;
