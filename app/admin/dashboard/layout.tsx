import AdminHeader from "@/components/admin/layout/AdminHeader";
import SignoutButton from "@/components/auth/SignoutButton";
import { Toaster } from "@/components/ui/toaster";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <AdminHeader />
      {children}
      <SignoutButton isAdmin />
      <Toaster />
    </div>
  );
};

export default layout;
