import { getPayments } from "@/actions/students";
import MainContainer from "@/components/layout/main-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

const StudentPaymentsPage = async () => {
  const payments = await getPayments();
  return (
    <MainContainer hasHeader className="block">
      <Card className="max-w-md w-full mx-auto">
        <CardHeader>
          <CardTitle>결제내역</CardTitle>
          <CardDescription>결제 정보를 확인해주세요.</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </MainContainer>
  );
};

export default StudentPaymentsPage;
