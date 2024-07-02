import { getHolidayDataFromApi } from "@/actions/common";
import MainContainer from "@/components/layout/main-container";
import ReadyContainer from "@/components/students/ReadyContainer";

export const dynamic = "force-dynamic";

const page = async ({ params }: { params: { id: string } }) => {
  const holidayData = await getHolidayDataFromApi();
  const studentId = params.id;
  return (
    <MainContainer className="block py-12" hasHeader>
      <ReadyContainer holidayData={holidayData} isAdmin studentId={studentId} />
    </MainContainer>
  );
};

export default page;
