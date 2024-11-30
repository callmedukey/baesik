"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StudentWithSchool } from "@/lib/definitions";
import { format } from "date-fns";
import { ko } from "date-fns/locale/ko";
import Link from "next/link";

const AdminFoundStudent = ({
  student,
  handleSelectStudent,
  selectedStudent,
}: {
  student: StudentWithSchool;
  handleSelectStudent: (studentId: string) => void;
  selectedStudent: boolean;
}) => {
  return (
    <div className="border rounded-sm border-gray-700 p-2 relative">
      <Checkbox
        className="absolute top-2 right-2"
        id={student.id}
        onCheckedChange={() => handleSelectStudent(student.id)}
        checked={selectedStudent}
      />
      <div>이름: {student.name}</div>
      <div>아이디: {student.username}</div>
      <div>이메일: {student.email}</div>
      <div>전화번호: {student.phone}</div>
      <div>학원: {student.school.name}</div>
      <div className="text-sm text-gray-400 text-right">
        가입일: {format(student.createdAt, "yyyy-MM-dd", { locale: ko })}
      </div>
      <Button asChild className="w-full mt-2" variant={"outline"}>
        <Link href={`/admin/dashboard/students/${student.id}/apply`}>
          식사 신청
        </Link>
      </Button>
      <Button asChild className="w-full mt-2" variant={"outline"}>
        <Link href={`/admin/dashboard/students/${student.id}`}>수정</Link>
      </Button>
      <Button asChild className="w-full mt-2" variant={"outline"}>
        <Link href={`/admin/dashboard/students/${student.id}/meals`}>
          식사 내역
        </Link>
      </Button>
    </div>
  );
};

export default AdminFoundStudent;
