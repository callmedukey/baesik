import { Button } from "@/components/ui/button";
import type { TeacherWithSchool } from "@/lib/definitions";
import { format } from "date-fns";
import { ko } from "date-fns/locale/ko";
import Link from "next/link";

const AdminFoundTeacher = ({ teacher }: { teacher: TeacherWithSchool }) => {
  return (
    <div className="border rounded-sm p-2">
      <div>이름: {teacher.name}</div>
      <div>아이디: {teacher.username}</div>
      <div>이메일: {teacher.email}</div>
      <div>전원번호: {teacher.phone}</div>
      <div>학원: {teacher.school.name}</div>
      <div className="text-sm text-gray-400 text-right">
        가입일: {format(teacher.createdAt, "yyyy-MM-dd", { locale: ko })}
      </div>
      <Button asChild className="w-full mt-2" variant={"outline"}>
        <Link href={`/admin/dashboard/school-admins/${teacher.id}`}>수정</Link>
      </Button>
    </div>
  );
};

export default AdminFoundTeacher;
