import { cn } from "@/lib/utils";
import React from "react";

const Contacts = ({ className }: { className?: string }) => {
  return (
    <p
      className={cn(
        "py-2 border px-2 rounded-md my-6 flex flex-col",
        className
      )}
    >
      <span className="font-semibold">
        평일 오전 8시에서 오후 5시까지 고객센터 운영
      </span>
      <span>010-6799-0830</span>
    </p>
  );
};

export default Contacts;
