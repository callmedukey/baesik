"use client";
import { updateboardPin } from "@/actions/admin";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "next/navigation";
import { useState } from "react";

const AdminBoardPin = ({ isPinned }: { isPinned: boolean }) => {
  const params = useParams();
  const postId = params.postId as string;

  const handlePinChange = async () => {
    const { message, error } = await updateboardPin(postId, !isPinned);
    if (message) {
      alert(message);
    } else if (error) {
      alert(error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" checked={isPinned} onClick={handlePinChange} />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        게시판 고정
      </label>
    </div>
  );
};

export default AdminBoardPin;
