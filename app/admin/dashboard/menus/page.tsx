import MenuForDayList from "@/components/admin/menus/MenuForDayList";
import MainContainer from "@/components/layout/main-container";

const page = () => {
  return (
    <MainContainer hasHeader className="block">
      <MenuForDayList />
    </MainContainer>
  );
};

export default page;
