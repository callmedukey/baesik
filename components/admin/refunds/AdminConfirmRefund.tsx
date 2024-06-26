"use client";

import { confirmSingleRefund } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { RefundRequestWithStudent } from "@/lib/definitions";
import { useState } from "react";
import { cloneDeep } from "lodash";

const AdminConfirmRefund = ({
  refundRequest,
  refundRequests,
  setRefundRequests,
}: {
  refundRequest: RefundRequestWithStudent;
  refundRequests: RefundRequestWithStudent[];
  setRefundRequests: (refundRequests: RefundRequestWithStudent[]) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleConfirmRefund = async () => {
    setIsLoading(true);
    const response = await confirmSingleRefund(refundRequest.id);

    if (!response) {
      alert("확불처리를 실패했습니다.");
      return;
    }

    if (response?.error) {
      alert(response.error);
    }

    if (response?.message) {
      const refundRequestsCopy = cloneDeep(refundRequests);
      const refundRequestCopy = cloneDeep(refundRequest);
      refundRequestCopy.complete = true;
      refundRequestsCopy[
        refundRequestsCopy.findIndex((r) => r.id === refundRequest.id)
      ] = refundRequestCopy;
      setRefundRequests(refundRequestsCopy);

      alert(response.message);
    }
    setIsLoading(false);
  };
  return (
    <Button
      className="w-full"
      variant={"outline"}
      onClick={handleConfirmRefund}
      disabled={isLoading || refundRequest.complete}
    >
      {isLoading
        ? "확불처리중..."
        : refundRequest.complete
        ? "환불완료"
        : "환불처리"}
    </Button>
  );
};

export default AdminConfirmRefund;
