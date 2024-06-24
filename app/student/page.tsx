import MainContainer from "@/components/layout/main-container";
import React from "react";
import getBeginningAndEndingDays from "@/lib/getBeginningAndEndingDays";
import { getMenu } from "@/actions/students";
import NotReadyContainer from "@/components/students/NotReadyContainer";

const StudentPage = async () => {
  const { beginningDay, endingDay } = getBeginningAndEndingDays();

  const data = await getMenu({
    fromDate: beginningDay.toISOString(),
    toDate: endingDay.toISOString(),
  });

  return (
    <MainContainer className="" hasHeader>
      {data && data?.notReady && (
        <NotReadyContainer beginningMonth={beginningDay.getMonth() + 1} />
      )}
    </MainContainer>
  );
};

export default StudentPage;
