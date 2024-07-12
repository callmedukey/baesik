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
import MealExcelExport from "@/components/common/MealExcelExport";

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

  const studentsWithLunch = React.useMemo(() => {
    return students.filter((student) =>
      student.meals.some((meal) => meal.mealType === "LUNCH")
    );
  }, [students]);

  const studentsWithDinner = React.useMemo(() => {
    return students.filter((student) =>
      student.meals.some((meal) => meal.mealType === "DINNER")
    );
  }, [students]);

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

  const excelData = React.useMemo(() => {
    if (!singleDay) return [];

    const data: any[][] = [
      [format(singleDay as Date, "yyyy-MM-dd")],
      [
        `점심 x ${studentsWithLunch.length}`,
        "",
        "",
        "",
        `저녁 x ${studentsWithDinner.length}`,
        "",
        "",
      ],
      ["No.", "이름", "확인", "", "No.", "이름", "확인"],
    ];

    const mostLength = Math.max(
      studentsWithLunch.length,
      studentsWithDinner.length
    );

    for (let i = 0; i < mostLength; i++) {
      if (studentsWithLunch[i] && studentsWithDinner[i]) {
        data.push([
          `${i + 1}`,
          studentsWithLunch[i].name,
          "",
          "",
          `${i + 1}`,
          studentsWithDinner[i].name,
          "",
        ]);
      }
      if (studentsWithLunch[i] && !studentsWithDinner[i]) {
        data.push([`${i + 1}`, studentsWithLunch[i].name, "", "", "", ""]);
      }
      if (!studentsWithLunch[i] && studentsWithDinner[i]) {
        data.push(["", "", "", "", `${i + 1}`, studentsWithDinner[i].name, ""]);
      }
    }

    return data;
  }, [studentsWithLunch, studentsWithDinner, singleDay]);

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
      {studentsWithMeals &&
        Array.isArray(studentsWithMeals) &&
        studentsWithMeals.length > 0 && (
          <MealExcelExport
            excelData={excelData}
            filename={format(singleDay as Date, "yyyy-MM-dd")}
          />
        )}
      {singleDay && (
        <div className="text-2xl text-center font-bold">
          <span>{format(singleDay, "yyyy-MM-dd")}</span>
        </div>
      )}
      <article className="grid md:grid-cols-2 gap-4 text-center place-items-start justify-center">
        {studentsWithLunch &&
        Array.isArray(studentsWithLunch) &&
        studentsWithLunch.length > 0 ? (
          <div className="max-w-sm">
            <div>점심 x{studentsWithLunch.length}</div>
            <DailyMealTable students={studentsWithLunch} />
          </div>
        ) : (
          <div className="text-center">점심 식사 학생이 없습니다.</div>
        )}
        {studentsWithDinner &&
        Array.isArray(studentsWithDinner) &&
        studentsWithDinner.length > 0 ? (
          <div className="max-w-sm">
            <div>저녁 x{studentsWithDinner.length}</div>
            <DailyMealTable students={studentsWithDinner} />
          </div>
        ) : (
          <div className="text-center">저녁 식사 학생이 없습니다.</div>
        )}
      </article>
    </section>
  );
}
