import AdminRefundsSearchContainer from "@/components/admin/refunds/AdminRefundsSearchContainer";
import MainContainer from "@/components/layout/main-container";

const AdminRefundsPage = async () => {
  return <MainContainer hasHeader className="block">
    <AdminRefundsSearchContainer/>
  </MainContainer>;
};

export default AdminRefundsPage;
