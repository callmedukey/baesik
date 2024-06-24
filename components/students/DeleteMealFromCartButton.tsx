"use client";

import { deleteSavedMeal } from "@/actions/students";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useToast } from "../ui/use-toast";

const DeleteMealFromCartButton = ({ id }: { id: string }) => {
  const { toast } = useToast();
  const deleteItemFromCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const { message, error } = await deleteSavedMeal(id);
    if (error) {
      alert("장바구니에서 삭제하는데 실패했습니다");
    }

    if (message) {
      toast({
        title: "삭제",
        description: message,
      });
    }
  };
  return (
    <button
      className="absolute right-0 hover:text-red-500 transition-colors duration-300 hover:scale-110"
      type="button"
      onClick={deleteItemFromCart}
    >
      <XMarkIcon className="size-4" />
    </button>
  );
};

export default DeleteMealFromCartButton;
