import MainContainer from "@/components/layout/main-container";
import SchoolGetListContainer from "@/components/school/SchoolGetListContainer";
import React from "react";
export const dynamic = "force-dynamic";
const SchoolPage = () => {
  return (
    <MainContainer className="block py-12" hasHeader>
      <SchoolGetListContainer />
    </MainContainer>
  );
};

export default SchoolPage;
