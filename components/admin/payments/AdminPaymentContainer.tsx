import { cn } from "@/lib/utils";
import type { Payments } from "@prisma/client";
import { format } from "date-fns";

const AdminPaymentContainer = ({ payment }: { payment: Payments }) => {
  return (
    <div className="border p-2 rounded-sm relative">
      <div
        className={cn(
          "absolute top-0 right-0 px-2 py-1 text-white rounded-full text-sm",
          payment.paid ? "bg-green-500" : "bg-red-500"
        )}
      >
        {payment.paid ? "입금" : "미입금"}
      </div>
      <div className="text-center">입금자: {payment.payer}</div>
      <div className="grid grid-cols-2 text-center my-4">
        <div>학생: {payment.studentName}</div>
        <div>{payment.schoolName}</div>
      </div>
      <div className="flex justify-between">
        <div className="text-left text-sm text-gray-500">
          {format(payment.createdAt, "yyyy-MM-dd HH:mm")}
        </div>
        <div className="text-right font-bold">
          {payment.amount.toLocaleString()}원
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentContainer;
