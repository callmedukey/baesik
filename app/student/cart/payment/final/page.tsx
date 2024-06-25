import { getPaymentAmount } from "@/actions/students";
import MainContainer from "@/components/layout/main-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
const page = async ({ searchParams }: { searchParams: { id: string } }) => {
  const { id } = searchParams;
  if (!id) {
    return redirect("/student");
  }
  const payment = await getPaymentAmount(id);
  return (
    <MainContainer hasHeader className="justify-start">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>입금 신청 완료</CardTitle>
          <CardDescription>
            아래 계좌정보로 입금을 진행해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <span>예금주: </span>
            <span>홍길동</span>
          </div>
          <div>
            <span>계좌: </span>
            <span>1234567890</span>
          </div>
          <div>
            <span>금액: </span>
            <span>{payment?.amount.toLocaleString()}원</span>
          </div>
        </CardContent>
        <CardFooter className="text-center block">
          <p>입금 후 결제내역에서 입금 완료 상태를 확인해주세요.</p>
          <p>확인이 안되신다면, 아래 연락처로 문의해주세요.</p>
          <p className="py-2 border px-2 rounded-md my-6">
            홍길동 010-1234-5678
          </p>
        </CardFooter>
      </Card>
    </MainContainer>
  );
};

export default page;
