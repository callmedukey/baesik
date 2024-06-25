import { getCancelableMeals } from "@/actions/students";
import MainContainer from "@/components/layout/main-container";
import CancelMealContainer from "@/components/students/CancelMealContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

const StudentCancelationPage = async () => {
  const cancelableMeals = await getCancelableMeals();
  return (
    <MainContainer hasHeader className="block">
      <Card className="max-w-md w-full mx-auto">
        <CardHeader>
          <CardTitle>학식 취소 요청</CardTitle>
          <CardDescription>최소 2일 전부터 취소 가능합니다.</CardDescription>
        </CardHeader>
        <CardContent className="">
          <CancelMealContainer meals={cancelableMeals} />
        </CardContent>
      </Card>
    </MainContainer>
  );
};

export default StudentCancelationPage;
