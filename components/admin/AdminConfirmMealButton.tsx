"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { confirmMeals } from "@/actions/admin";

const AdminConfirmMealButton = ({ meals }: { meals: { id: string }[] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleConfirm = async () => {
    if (!confirm("확정 후 학생이 취소가 불가합니다. 정말 확정하시겠습니까?"))
      return;

    setIsLoading(true);
    const { error, message } = await confirmMeals(meals);
    setIsLoading(false);

    if (error) {
      alert();
    }
    if (message) {
      alert(message);
    }
  };
  return (
    <Button variant={"outline"} onClick={handleConfirm} type="button">
      {isLoading ? "확정중..." : "확정"}
    </Button>
  );
};

export default AdminConfirmMealButton;
