import { getCancelHistory, getCancelableMeals } from "@/actions/students";
import MainContainer from "@/components/layout/main-container";
import CancelMealContainer from "@/components/students/CancelMealContainer";
import CancelMealHistoryContainer from "@/components/students/CancelMealHistoryContainer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

const StudentCancelationPage = async () => {
  const cancelableMeals = await getCancelableMeals();
  const cancelHistory = await getCancelHistory();
  return (
    <MainContainer hasHeader className="justify-start">
      <div className="max-w-md w-full mx-auto">
        <Tabs defaultValue="cancel" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="cancel" className="w-full">
              취소 신청
            </TabsTrigger>
            <TabsTrigger value="history" className="w-full">
              취소 내역
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cancel">
            <Card className="max-w-md w-full mx-auto">
              <CardHeader>
                <CardTitle>식사 취소 요청</CardTitle>
                <CardDescription>
                  최소 2일 전까지 취소 가능합니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="">
                <CancelMealContainer meals={cancelableMeals} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history">
            <Card className="max-w-md w-full mx-auto">
              <CardHeader>
                <CardTitle>취소 내역</CardTitle>
                <CardDescription>
                  재신청은 재신청 페이지 에서 확인해주세요
                </CardDescription>
              </CardHeader>
              <CardContent className="">
                <CancelMealHistoryContainer meals={cancelHistory} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainContainer>
  );
};

export default StudentCancelationPage;
