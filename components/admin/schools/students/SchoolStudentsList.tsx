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

export type StudentsWithLunchAndDinner = Record<
  string,
  {
    name: string;
    hasLunch: boolean;
    hasDinner: boolean;
  }
>;

export type StudentsWithLunchAndDinnerArray = {
  studentId: string;
  name: string;
  hasLunch: boolean;
  hasDinner: boolean;
}[];

export function SchoolStudentsList({ schoolId }: { schoolId: string }) {
  const [singleDay, setSingleDay] = React.useState<Date | undefined>(undefined);

  const [loading, setLoading] = React.useState(false);

  const [students, setStudents] = React.useState<StudentsWithMeals[]>([]);

  const studentsWithMeals: StudentsWithLunchAndDinnerArray =
    React.useMemo(() => {
      const studentMeals: StudentsWithLunchAndDinner = {};
      students.forEach((student) => {
        studentMeals[student.id] = {
          name: student.name,
          hasLunch: student.meals.some((meal) => meal.mealType === "LUNCH"),
          hasDinner: student.meals.some((meal) => meal.mealType === "DINNER"),
        };
      });
      return Object.entries(studentMeals)
        .map(([studentId, meals]) => ({
          studentId,
          ...meals,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }, [students, singleDay]);

  const studentWithLunchCount = React.useMemo(() => {
    return studentsWithMeals.filter((student) => student.hasLunch).length;
  }, [studentsWithMeals]);

  const studentWithDinnerCount = React.useMemo(() => {
    return studentsWithMeals.filter((student) => student.hasDinner).length;
  }, [studentsWithMeals]);

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
      {singleDay && (
        <div className="text-2xl text-center font-bold">
          <span>{format(singleDay, "yyyy-MM-dd")}</span>
        </div>
      )}
      {studentsWithMeals &&
      Array.isArray(studentsWithMeals) &&
      studentsWithMeals.length > 0 ? (
        <DailyMealTable
          students={studentsWithMeals}
          lunchCount={studentWithLunchCount}
          dinnerCount={studentWithDinnerCount}
        />
      ) : (
        <div className="text-center">학생이 없습니다.</div>
      )}
    </section>
  );
}
