"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { ko } from "date-fns/locale/ko";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { findStudentsWithMeals } from "@/actions/schools";
import SchoolListContainer from "./SchoolListContainer";
import type { StudentsWithMeals } from "@/lib/definitions";

export type AvailableDay = {
  date: string;
  isLunch: boolean;
  isDinner: boolean;
};

const SchoolGetListContainer = ({}: {}) => {
  const [applicationDate, setApplicationDate] = useState<DateRange | undefined>(
    {
      from: undefined,
      to: undefined,
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [studentsWithMeals, setStudentsWithMeals] = useState<
    StudentsWithMeals[]
  >([]);

  const handleApply = async () => {
    if (!applicationDate) return;
    setIsLoading(true);
    const students = await findStudentsWithMeals(applicationDate);

    if (students && students.length > 0) {
      setStudentsWithMeals(students);
    } else alert("학식을 신청한 학생이 없습니다");

    setIsLoading(false);
  };

  return (
    <div className="w-full space-y-4">
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
            className="w-[100px]"
          >
            {isLoading ? "조회중..." : "조회"}
          </Button>
        </aside>
        <SchoolListContainer studentsWithMeals={studentsWithMeals} />
      </div>
    </div>
  );
};

export default SchoolGetListContainer;
