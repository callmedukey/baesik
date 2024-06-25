import MainContainer from "@/components/layout/main-container";
import React from "react";
import getBeginningAndEndingDays from "@/lib/getBeginningAndEndingDays";
import { getMenu } from "@/actions/students";
import NotReadyContainer from "@/components/students/NotReadyContainer";
import ReadyContainer from "@/components/students/ReadyContainer";
import { getHolidayDataFromApi } from "@/actions/common";

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
      {data && data?.notReady && (
        <NotReadyContainer beginningMonth={beginningDay.getMonth() + 1} />
      )}

      {data && data?.ready && (
        <ReadyContainer
          validFiles={data.validFiles as string[]}
          holidayData={holidayData}
        />
      )}
    </MainContainer>
  );
};

export default StudentPage;
