import { getSchoolWithStudents } from "@/actions/admin";
import { SchoolStudentsList } from "@/components/admin/schools/students/SchoolStudentsList";
import MainContainer from "@/components/layout/main-container";
import React from "react";

export const dynamic = "force-dynamic";

const SchoolsStudentListPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const school = await getSchoolWithStudents(params.id);
  return (
    <MainContainer hasHeader className="block min-h-[150vh]">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-primary text-center">
          {school.name}
        </h1>
        <SchoolStudentsList schoolId={school.id} />
      </div>
    </MainContainer>
  );
};

export default SchoolsStudentListPage;
