import { adminFindSingleStudent } from "@/actions/admin";
import AdminSingleStudentContainer from "@/components/admin/students/student/AdminSingleStudentContainer";
import MainContainer from "@/components/layout/main-container";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const AdminStudentPage = async ({ params }: { params: { id: string } }) => {
  const studentId = params.id;

  if (!studentId) {
    return redirect("/admin/dashboard/students");
  }

  const foundStudent = await adminFindSingleStudent(studentId);
  const schools = await prisma.school.findMany();

  if (!foundStudent) {
    return redirect("/404");
  }
  return (
    <MainContainer className="block" hasHeader>
      <AdminSingleStudentContainer student={foundStudent} schools={schools} />
    </MainContainer>
  );
};

export default AdminStudentPage;
