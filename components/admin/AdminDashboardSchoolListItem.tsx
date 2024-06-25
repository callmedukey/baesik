"use client";

import type { SchoolsWithStudentsWithMeals } from "@/lib/definitions";

const AdminDashboardSchoolListItem = ({
  school,
}: {
  school: SchoolsWithStudentsWithMeals;
}) => {
  const studentsWithLunch = school.students.filter((student) =>
    student.meals.some((meal) => meal.mealType === "LUNCH")
  );
  const studentsWithDinner = school.students.filter((student) =>
    student.meals.some((meal) => meal.mealType === "DINNER")
  );

  return (
    <div className="p-2 border rounded-sm">
      <h3 className="text-lg font-semibold">{school.name}</h3>
      <div className="grid grid-cols-2 text-center py-2">
        <div className="grid divide-y-2">
          <div>점심 </div>
          <div>{studentsWithLunch.length}</div>
        </div>
        <div className="grid divide-y-2 border-l-2">
          <div>저녁 </div>
          <div>{studentsWithDinner.length}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardSchoolListItem;
