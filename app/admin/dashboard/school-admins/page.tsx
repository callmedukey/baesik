import AdminSchoolUserSeachContainer from "@/components/admin/schools/AdminSchoolUserSeachContainer";

import MainContainer from "@/components/layout/main-container";
import React from "react";

const page = () => {
  return (
    <MainContainer hasHeader className="block">
      <AdminSchoolUserSeachContainer />
    </MainContainer>
  );
};

export default page;
