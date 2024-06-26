import { createAdmin } from "@/actions/auth";
import AdminLoginFormContainer from "@/components/admin/AdminLoginFormContainer";
import MainContainer from "@/components/layout/main-container";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const AdminPage = async () => {
  const adminsCount = await prisma.admin.count();

  if (adminsCount === 0) {
    await createAdmin({
      username: "admin",
      password: "admin2024@",
    });
  }

  return (
    <MainContainer>
      <AdminLoginFormContainer />
    </MainContainer>
  );
};

export default AdminPage;
