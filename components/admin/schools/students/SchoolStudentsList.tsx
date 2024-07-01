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
import SchoolListItem from "@/components/school/SchoolListItem";

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

  // const studentsWithMeals = React.useMemo(() => {
  //   const obj: {
  //     [key: string]: {
  //       name: string;
  //       date: any;
  //       hasLunch: boolean;
  //       hasDinner: boolean;
  //     };
  //   } = {};

  //   students.forEach((student, i) => {
  //     obj[student.id] = {
  //       name: student.name,
  //       date: student.meals.map((meal) => meal.date)[i],
  //       hasLunch: student.meals.some((meal) => meal.mealType === "LUNCH"),
  //       hasDinner: student.meals.some((meal) => meal.mealType === "DINNER"),
  //     };
  //     // obj[student.name]["date"] = student.meals.map((meal) => meal.date)[0];
  //     // obj[student.name]["hasLunch"] = student.meals.some(
  //     //   (meal) => meal.mealType === "LUNCH"
  //     // );
  //     // obj[student.name]["hasDinner"] = student.meals.some(
  //     //   (meal) => meal.mealType === "DINNER"
  //     // );
  //   });

  //   console.log(
  //     Object.entries(obj).map(([key, value]) => ({
  //       name: key,
  //       date: value.date,
  //       hasLunch: value.hasLunch,
  //       hasDinner: value.hasDinner,
  //     }))
  //   );
  //   return [];
  // }, [students]);

  const studentsWithLunch = React.useMemo(
    () =>
      students.filter((student) => {
        if (student.meals.some((meal) => meal.mealType === "LUNCH")) {
          return true;
        }
      }),
    [students]
  );

  const studentsWithDinner = React.useMemo(
    () =>
      students.filter((student) => {
        if (student.meals.some((meal) => meal.mealType === "DINNER")) {
          return true;
        }
      }),
    [students]
  );

  const handleSearch = async () => {
    setLoading(true);
    const listOfStudents = await getStudentsWithMeals({
      schoolId,
      fromDate: date?.from ? date.from : new Date(),
      toDate: date?.to ? date.to : new Date(),
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
        <div className="grid grid-cols-2 gap-2 items-start justify-center text-center max-w-md w-full mx-auto">
          <div className="space-y-2">
            <div className="border shadow-sm py-2 rounded-md">
              점심 x{studentsWithLunch.length}
            </div>
            {studentsWithLunch.map((student) => {
              return (
                <SchoolListItem key={student.id} studentWithMeal={student} />
              );
            })}
          </div>
          <div className="space-y-2">
            <div className="border shadow-sm py-2 rounded-md">
              저녁 x{studentsWithDinner.length}
            </div>
            {studentsWithDinner.map((student) => {
              return (
                <SchoolListItem key={student.id} studentWithMeal={student} />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center">학생이 없습니다.</div>
      )}
    </section>
  );
}
