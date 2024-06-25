import type { StudentsWithMeals } from "@/lib/definitions";
import { useMemo } from "react";
import SchoolListItem from "./SchoolListItem";

const SchoolListContainer = ({
  studentsWithMeals,
}: {
  studentsWithMeals: StudentsWithMeals[];
}) => {
  const studentsWithLunch = useMemo(
    () =>
      studentsWithMeals.filter((student) => {
        if (student.meals.some((meal) => meal.mealType === "LUNCH")) {
          return true;
        }
      }),
    [studentsWithMeals]
  );

  const studentsWithDinner = useMemo(
    () =>
      studentsWithMeals.filter((student) => {
        if (student.meals.some((meal) => meal.mealType === "DINNER")) {
          return true;
        }
      }),
    [studentsWithMeals]
  );

  return (
    <div className="grid grid-cols-2 gap-2 items-start justify-center text-center max-w-md w-full mx-auto">
      <div className="space-y-2">
        <div className="border shadow-sm py-2 rounded-md">
          점심 x{studentsWithLunch.length}
        </div>
        {studentsWithLunch.map((student) => {
          return <SchoolListItem key={student.id} studentWithMeal={student} />;
        })}
      </div>
      <div className="space-y-2">
        <div className="border shadow-sm py-2 rounded-md">
          저녁 x{studentsWithDinner.length}
        </div>
        {studentsWithDinner.map((student) => {
          return <SchoolListItem key={student.id} studentWithMeal={student} />;
        })}
      </div>
    </div>
  );
};

export default SchoolListContainer;
