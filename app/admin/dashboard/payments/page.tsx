import AdminPaymentsSearchContainer from "@/components/admin/payments/AdminPaymentsSearchContainer";
import MainContainer from "@/components/layout/main-container";

const AdminPaymentsPage = () => {
  return (
    <MainContainer hasHeader className="block">
      <AdminPaymentsSearchContainer />
    </MainContainer>
  );
};

export default AdminPaymentsPage;
