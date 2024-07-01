"use client";
import * as React from "react";
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
import type { Meals, Student } from "@prisma/client";
import { getStudentsWithMeals } from "@/actions/admin";
import DailyMealTable from "@/components/DailyMealTable";

interface StudentsWithMeals extends Student {
  meals: Meals[];
}

export function School({ schoolId }: { schoolId: string }) {
  const [singleDay, setSingleDay] = React.useState<Date | undefined>(undefined);

  const [loading, setLoading] = React.useState(false);

  const [students, setStudents] = React.useState<StudentsWithMeals[]>([]);

  const studentsWithLunch = React.useMemo(
    () =>
      students
        .filter((student) => {
          if (student.meals.some((meal) => meal.mealType === "LUNCH")) {
            return true;
          }
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
    [students]
  );

  const studentsWithDinner = React.useMemo(
    () =>
      students
        .filter((student) => {
          if (student.meals.some((meal) => meal.mealType === "DINNER")) {
            return true;
          }
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
    [students]
  );

  const handleSearch = async () => {
    setLoading(true);
    if (!singleDay) {
      alert("날짜를 선택해주세요.");
      return;
    }
    const listOfStudents = await getStudentsWithMeals({
      schoolId,
      fromDate: singleDay,
      toDate: singleDay,
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
      <aside className="my-6 flex items-center justify-center gap-4 print:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !singleDay && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {singleDay ? (
                <>{format(singleDay, "yyyy-MM-dd")}</>
              ) : (
                <span>날짜 선택</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="single"
              locale={ko}
              selected={singleDay}
              onSelect={(day) => setSingleDay(day || undefined)}
            />
          </PopoverContent>
        </Popover>
        <Button
          disabled={!singleDay || loading}
          onClick={handleSearch}
          type="button"
        >
          조회
        </Button>
      </aside>

      {students && Array.isArray(students) && students.length > 0 ? (
        <div className="flex flex-col justify-center items-center gap-4 lg:grid lg:grid-cols-2 lg:items-start text-center print:grid print:grid-cols-2 print:items-start">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-600">
              점심 x{studentsWithLunch.length}
            </h2>
            <DailyMealTable students={studentsWithLunch} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-600">
              저녁 x{studentsWithDinner.length}
            </h2>
            <DailyMealTable students={studentsWithDinner} />
          </div>
        </div>
      ) : (
        <div className="text-center">학생이 없습니다.</div>
      )}
    </section>
  );
}
