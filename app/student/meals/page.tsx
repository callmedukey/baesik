import { getStudentMealHistory } from "@/actions/students";
import StudentMealHistory from "@/components/StudentMealHistory";
import MainContainer from "@/components/layout/main-container";

export const dynamic = "force-dynamic";

const page = async () => {
  const meals = await getStudentMealHistory();

  return (
    <MainContainer hasHeader className="block">
      <StudentMealHistory meals={meals} isAdmin={false} />
    </MainContainer>
  );
};

export default page;
