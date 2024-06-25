import { findStudents } from "@/actions/schools";
import MainContainer from "@/components/layout/main-container";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

const ManageSchoolPage = async () => {
  const students = await findStudents();
  return (
    <MainContainer className="block py-12" hasHeader>
      <aside className="mx-auto max-w-sm w-full text-center text-xl font-bold">
        가입 학생 수: {students?.length.toLocaleString()}
      </aside>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 mx-auto max-w-6xl text-center px-2 my-6">
        {students?.map((student) => {
          return (
            <div
              key={student.id}
              className="space-y-0.5 rounded-md border shadow-sm p-2"
            >
              <div>{student.name}</div>
              <div className="text-sm text-gray-500">
                가입일: {format(student.createdAt, "yyyy-MM-dd")}
              </div>
            </div>
          );
        })}
      </div>
    </MainContainer>
  );
};

export default ManageSchoolPage;
