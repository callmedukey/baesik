import { verifySession } from "@/actions/session";
import { SchoolStudentsList } from "@/components/admin/schools/students/SchoolStudentsList";
import MainContainer from "@/components/layout/main-container";
import { redirect } from "next/navigation";

import React from "react";
export const dynamic = "force-dynamic";
const SchoolPage = async () => {
  const session = await verifySession();

  if (!session.schoolId) redirect("/login");

  return (
    <MainContainer className="block py-12" hasHeader>
      <section className="max-w-xl mx-auto">
        <SchoolStudentsList schoolId={session.schoolId} />
      </section>
    </MainContainer>
  );
};

export default SchoolPage;
