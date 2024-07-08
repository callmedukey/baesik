import { verifySession } from "@/actions/session";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import SignoutButton from "@/components/auth/SignoutButton";
import { Toaster } from "@/components/ui/toaster";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await verifySession();
  if (!session || !session?.isAdmin) {
    return redirect("/admin");
  }
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
