import AdminUserSearchContainer from "@/components/admin/students/AdminSearchUser";
import MainContainer from "@/components/layout/main-container";



const AdminUsersPage = async () => {
  return (
    <MainContainer className="block" hasHeader>
      <AdminUserSearchContainer />
    </MainContainer>
  );
};

export default AdminUsersPage;
