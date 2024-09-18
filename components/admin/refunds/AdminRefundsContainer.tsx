import type { RefundRequestWithStudent } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import AdminConfirmRefund from "./AdminConfirmRefund";

const AdminRefundsContainer = ({
  refundRequest,
  setRefundRequests,
  refundRequests,
}: {
  refundRequest: RefundRequestWithStudent;
  setRefundRequests: (refundRequests: RefundRequestWithStudent[]) => void;
  refundRequests: RefundRequestWithStudent[];
}) => {
  return (
    <div className="border p-2 rounded-sm relative">
      <div
        className={cn(
          "absolute top-0 right-0 px-2 py-1 text-white rounded-full text-sm",
          refundRequest.complete ? "bg-green-500" : "bg-red-500"
        )}
      >
        {refundRequest.complete ? "완료" : "미완료"}
      </div>
      <div className="text-center">예금주: {refundRequest.accountHolder}</div>

      <div>학생: {refundRequest.student.name}</div>
      <div>학원: {refundRequest.student.school.name}</div>
      <div>은행: {refundRequest.bankName}</div>
      <div>계좌번호: {refundRequest.bankDetails}</div>
      <div className="flex justify-between">
        <div className="text-left text-sm text-gray-500">
          {format(refundRequest.createdAt, "yyyy-MM-dd HH:mm")}
        </div>
        <div className="text-right font-bold">
          {refundRequest.amount.toLocaleString()}원
        </div>
      </div>
      <AdminConfirmRefund
        refundRequests={refundRequests}
        refundRequest={refundRequest}
        setRefundRequests={setRefundRequests}
      />
    </div>
  );
};

export default AdminRefundsContainer;
