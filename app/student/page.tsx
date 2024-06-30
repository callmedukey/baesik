import MainContainer from "@/components/layout/main-container";
import React from "react";

import MonthlyMenuContainer from "@/components/students/MonthlyMenuContainer";

export const dynamic = "force-dynamic";

const StudentPage = async () => {
  return (
    <MainContainer className="block py-12" hasHeader>
      <MonthlyMenuContainer />
    </MainContainer>
  );
};

export default StudentPage;
