import AdminHeader from "@/components/admin/layout/AdminHeader";
import { Toaster } from "@/components/ui/toaster";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AdminHeader />
      {children}
      <Toaster />
    </div>
  );
};

export default layout;
