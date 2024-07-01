import { adminFindSingleTeacher } from "@/actions/admin";
import MainContainer from "@/components/layout/main-container";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AdminSingleTeacherContainer from "@/components/admin/schools/AdminSingleTeacherContainer";
import { TeacherWithSchool } from "@/lib/definitions";

export const dynamic = "force-dynamic";

const AdminStudentPage = async ({ params }: { params: { id: string } }) => {
  const teacherId = params.id;

  if (!teacherId) {
    return redirect("/admin/dashboard/school-admins");
  }

  const foundTeacher = await adminFindSingleTeacher(teacherId);
  const schools = await prisma.school.findMany();

  if (!foundTeacher) {
    return redirect("/404");
  }
  return (
    <MainContainer className="block" hasHeader>
      <AdminSingleTeacherContainer
        teacher={foundTeacher as TeacherWithSchool}
        schools={schools}
      />
    </MainContainer>
  );
};

export default AdminStudentPage;
