import AdminLoginFormContainer from "@/components/admin/AdminLoginFormContainer";
import MainContainer from "@/components/layout/main-container";

const AdminPage = async () => {
  return (
    <MainContainer>
      <AdminLoginFormContainer />
    </MainContainer>
  );
};

export default AdminPage;
