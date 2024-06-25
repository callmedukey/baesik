import { getReversibleMeals } from "@/actions/students";
import MainContainer from "@/components/layout/main-container";
import ReverseCancelMealContainer from "@/components/students/ReverseCancelMealContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

const ReverseCancelationPage = async () => {
  const reversible = await getReversibleMeals();

  return (
    <MainContainer hasHeader className="block">
      <Card className="max-w-md w-full mx-auto">
        <CardHeader>
          <CardTitle>재신청</CardTitle>
          <CardDescription>당일 재신청은 어렵습니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <ReverseCancelMealContainer meals={reversible} />
        </CardContent>
      </Card>
    </MainContainer>
  );
};

export default ReverseCancelationPage;
