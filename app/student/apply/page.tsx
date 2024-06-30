import { getHolidayDataFromApi } from "@/actions/common";
import MainContainer from "@/components/layout/main-container";
import ReadyContainer from "@/components/students/ReadyContainer";

export const dynamic = "force-dynamic";
const page = async () => {
  const holidayData = await getHolidayDataFromApi();
  return (
    <MainContainer className="block py-12" hasHeader>
      <ReadyContainer holidayData={holidayData} />
    </MainContainer>
  );
};

export default page;
