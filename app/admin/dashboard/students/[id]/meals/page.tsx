import { getStudentMealHistory } from "@/actions/admin";
import StudentMealHistory from "@/components/StudentMealHistory";
import MainContainer from "@/components/layout/main-container";

export const dynamic = "force-dynamic";

const page = async ({ params }: { params: { id: string } }) => {
  const meals = await getStudentMealHistory(params.id);

  return (
    <MainContainer hasHeader className="block py-12">
      <StudentMealHistory meals={meals} isAdmin />
    </MainContainer>
  );
};

export default page;
