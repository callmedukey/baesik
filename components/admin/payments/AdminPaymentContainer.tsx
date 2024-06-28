"use client";
import { deletePayment, manualConfirmPayment } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Payments } from "@prisma/client";
import { format } from "date-fns";
import { cloneDeep } from "lodash";
import { Dispatch, SetStateAction } from "react";

const AdminPaymentContainer = ({
  payment,
  payments,
  setPayments,
}: {
  payment: Payments;
  payments: Payments[];
  setPayments: Dispatch<SetStateAction<Payments[]>>;
}) => {
  const handleConfirmPayment = async () => {
    const updatedPayment = await manualConfirmPayment(
      payment.id,
      !payment.paid
    );
    if (updatedPayment) {
      const clone = cloneDeep(payments);
      const clonePayment = cloneDeep(payment);
      clonePayment.paid = updatedPayment.paid;
      const index = clone.findIndex((p) => p.id === payment.id);
      clone[index] = clonePayment;
      setPayments(clone);
    }
  };

  const handleDeletePayment = async () => {
    if (!confirm("정말로 삭제하시겠습니까? 복구 불가합니다")) return;
    const response = await deletePayment(payment.id);
    if (response.error) {
      alert(response.error);
    }
    if (response.message) {
      alert(response.message);
      setPayments(payments.filter((p) => p.id !== payment.id));
    }
  };

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
      <div className="grid grid-cols-2 text-center my-4 text-sm">
        <div>학생: {payment.studentName}</div>
        <div>{payment.schoolName}</div>
      </div>
      <div className="text-center">{payment.payerPhone}</div>
      <div className="flex justify-between">
        <div className="text-left text-sm text-gray-500">
          {format(payment.createdAt, "yyyy-MM-dd HH:mm")}
        </div>
        <div className="text-right font-bold">
          {payment.amount.toLocaleString()}원
        </div>
      </div>
      <Button
        className="w-full mt-2"
        variant={"outline"}
        onClick={handleConfirmPayment}
      >
        입금 상태 변경
      </Button>
      <Button
        className="w-full mt-2"
        variant={"destructive"}
        onClick={handleDeletePayment}
      >
        입금 상태 변경
      </Button>
    </div>
  );
};

export default AdminPaymentContainer;
