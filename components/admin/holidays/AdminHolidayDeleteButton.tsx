"use client";
import { deleteHoliday } from "@/actions/admin";
import { useState } from "react";

const AdminHolidayDeleteButton = ({ holidayId }: { holidayId: string }) => {
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    if (!confirm("정말로 삭제하시겠습니까?")) return;
    setLoading(true);

    const { message } = await deleteHoliday(holidayId);
    alert(message);
    setLoading(false);
  };
  return (
    <button
      className="!m-0"
      type="button"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? "삭제중..." : "삭제"}
    </button>
  );
};

export default AdminHolidayDeleteButton;
