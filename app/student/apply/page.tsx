import { getCustomHolidays, getHolidayDataFromApi } from "@/actions/common";
import MainContainer from "@/components/layout/main-container";
import ReadyContainer from "@/components/students/ReadyContainer";

export const dynamic = "force-dynamic";
const page = async () => {
  const holidayData = await getHolidayDataFromApi();
  const customHolidays = await getCustomHolidays();
  return (
    <MainContainer className="block py-12" hasHeader>
      <ReadyContainer holidayData={holidayData} customHolidays={customHolidays} />
    </MainContainer>
  );
};

export default page;
