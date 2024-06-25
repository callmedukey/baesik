"use client";

import { cancelPayment } from "@/actions/students";
import { Button } from "../ui/button";

const CancelPaymentButton = ({ id }: { id: string }) => {
  const handleCancelation = async () => {
    if (!confirm("결제 취소 요청을 하시겠습니까?")) {
      return;
    }
    const result = await cancelPayment(id);
    if (result) {
      alert("결제 취소 요청이 완료되었습니다.");
    } else {
      alert("결제 취소 요청이 실패하였습니다.");
    }
  };
  return (
    <Button
      variant={"outline"}
      className="w-full hover:bg-red-500 hover:text-white"
      onClick={handleCancelation}
    >
      결제 취소 요청
    </Button>
  );
};

export default CancelPaymentButton;
