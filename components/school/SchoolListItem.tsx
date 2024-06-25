import type { StudentsWithMeals } from "@/lib/definitions";
import React from "react";

const SchoolListItem = ({
  studentWithMeal,
}: {
  studentWithMeal: StudentsWithMeals;
}) => {
  return <div className="text-sm text-gray-500">{studentWithMeal.name}</div>;
};

export default React.memo(SchoolListItem);
