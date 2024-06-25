import MainContainer from "@/components/layout/main-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

const StudentPaymentsPage = () => {
  return (
    <MainContainer hasHeader className="block">
      <h1 className="text-center">결제내역</h1>
    </MainContainer>
  );
};

export default StudentPaymentsPage;
