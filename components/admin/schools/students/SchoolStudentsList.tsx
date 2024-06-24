"use client";
import * as React from "react";
import { ko } from "date-fns/locale/ko";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { DateRange } from "react-day-picker";
import type { Meals, Student } from "@prisma/client";
import { getStudentsWithMeals } from "@/actions/admin";

interface StudentsWithMeals extends Student {
  meals: Meals[];
}

export function SchoolStudentsList({ schoolId }: { schoolId: string }) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 14),
  });

  const [loading, setLoading] = React.useState(false);

  const [students, setStudents] = React.useState<StudentsWithMeals[]>([]);

  const handleSearch = async () => {
    setLoading(true);
    const listOfStudents = await getStudentsWithMeals({
      schoolId,
      fromDate: date?.from ? new Date(date.from) : new Date(),
      toDate: date?.to ? new Date(date.to) : new Date(),
    });

    if (listOfStudents && Array.isArray(listOfStudents))
      setStudents(listOfStudents);
    setLoading(false);

    if (!listOfStudents) {
      alert("학생 조회에 실패했습니다.");
    }
  };
  return (
    <section>
      <aside className="my-6 flex items-center justify-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "yyyy-MM-dd")} -{" "}
                    {format(date.to, "yyyy-MM-dd")}
                  </>
                ) : (
                  format(date.from, "yyyy-MM-dd")
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
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Button
          disabled={!date || loading}
          onClick={handleSearch}
          type="button"
        >
          조회
        </Button>
      </aside>

      {students && Array.isArray(students) && students.length > 0 ? (
        <div>
          <h2>학생 목록</h2>
        </div>
      ) : (
        <div className="text-center">학생이 없습니다.</div>
      )}
    </section>
  );
}
