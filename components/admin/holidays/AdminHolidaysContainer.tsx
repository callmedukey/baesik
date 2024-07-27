import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getHolidays } from "@/actions/admin";
import React from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale/ko";
import AdminHolidayDeleteButton from "./AdminHolidayDeleteButton";

const AdminHolidaysContainer = async () => {
  const holidays = await getHolidays();

  if (!holidays)
    return (
      <section className="flex flex-col items-center justify-center min-h-[300px] w-full">
        <div>오류입니다</div>
      </section>
    );

  if (Array.isArray(holidays) && holidays.length === 0)
    return (
      <section className="flex flex-col items-center justify-center min-h-[300px] w-full">
        <div>휴일 설정이 없습니다.</div>
      </section>
    );

  return (
    <Table className="max-w-xl w-full mx-auto border rounded-md">
      <TableHeader className="max-w-xl w-full">
        <TableRow className="divide-x">
          <TableHead className="w-[200px] text-center">휴일</TableHead>
          <TableHead className="text-center"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holidays.map((holiday) => (
          <TableRow key={holiday.id} className="divide-x text-center">
            <TableCell>
              {format(holiday.date, "yyyy-MM-dd", { locale: ko })}
            </TableCell>
            <TableCell className="w-[50px]">
              <AdminHolidayDeleteButton holidayId={holiday.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminHolidaysContainer;
