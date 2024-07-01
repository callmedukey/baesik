"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StudentsWithMeals } from "@/lib/definitions";

const DailyMealTable = ({ students }: { students: StudentsWithMeals[] }) => {
  return (
    <Table className="max-w-sm w-full mx-auto border rounded-md">
      <TableHeader className="max-w-sm w-full">
        <TableRow className="divide-x">
          <TableHead className="w-[50px]">No.</TableHead>
          <TableHead className="text-center">이름</TableHead>
          <TableHead className="text-center">확인</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student, index) => (
          <TableRow key={student.id} className="divide-x text-center">
            <TableCell>{index + 1}</TableCell>
            <TableCell className="">{student.name}</TableCell>
            <TableCell className="w-[100px] border" />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DailyMealTable;
