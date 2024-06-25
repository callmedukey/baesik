import { getPayments } from "@/actions/students";
import MainContainer from "@/components/layout/main-container";
import CancelPaymentButton from "@/components/students/CancelPaymentButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";

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
        <CardContent className="space-y-2">
          {payments.map((payment) => {
            return (
              <div key={payment.id} className="border rounded-md shadow-sm p-2">
                <p className="text-right border-b pb-2 text-sm text-gray-500">
                  결제 요청일: {format(payment.createdAt, "yyyy-MM-dd HH:mm")}
                </p>
                <p className="text-center flex items-center justify-center py-2">
                  {" "}
                  학식 총 수량: {payment._count.meals}
                </p>
                <p className="text-center">입금자: {payment.payer}</p>
                <div className="grid grid-cols-2 text-center border divide-x-2">
                  <div className="grid p-2 divide-y-2">
                    <div>결제금액</div>
                    <div>{payment.amount.toLocaleString()}원</div>
                  </div>
                  <div className="grid p-2 divide-y-2">
                    <div>결제상태</div>
                    <div>{payment.paid ? "입금완료" : "미입금"}</div>
                  </div>
                </div>
                {!payment.paid && <CancelPaymentButton id={payment.id} />}
              </div>
            );
          })}
          {payments.length === 0 && (
            <div className="text-center text-sm text-gray-500 mt-6">
              결제 내역이 없습니다.
            </div>
          )}
        </CardContent>
      </Card>
    </MainContainer>
  );
};

export default StudentPaymentsPage;
