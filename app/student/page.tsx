import MainContainer from "@/components/layout/main-container";
import React from "react";
import getBeginningAndEndingDays from "@/lib/getBeginningAndEndingDays";
import { getMenu } from "@/actions/students";
import NotReadyContainer from "@/components/students/NotReadyContainer";
import ReadyContainer from "@/components/students/ReadyContainer";
import { getHolidayDataFromApi } from "@/actions/common";

export const dynamic = "force-dynamic";

const StudentPage = async () => {
  const { beginningDay, endingDay } = getBeginningAndEndingDays();

  const [data, holidayData] = await Promise.all([
    getMenu({
      fromDate: beginningDay,
      toDate: endingDay,
    }),
    getHolidayDataFromApi(),
  ]);

  return (
    <MainContainer className="block py-12" hasHeader>
      <ReadyContainer
        validFiles={data.validFiles as string[]}
        holidayData={holidayData}
      />
    </MainContainer>
  );
};

export default StudentPage;
