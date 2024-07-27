import { AdminHolidaySearchContainer } from "@/components/admin/holidays/AdminHolidaySearchContainer";
import AdminHolidaysContainer from "@/components/admin/holidays/AdminHolidaysContainer";

import MainContainer from "@/components/layout/main-container";

const page = () => {
  return (
    <MainContainer hasHeader className="block">
      <AdminHolidaySearchContainer />
      <AdminHolidaysContainer />
    </MainContainer>
  );
};

export default page;
