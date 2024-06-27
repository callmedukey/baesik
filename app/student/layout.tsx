import Contacts from "@/components/admin/layout/Contacts";
import StudentHeader from "@/components/admin/layout/StudentHeader";
import SignoutButton from "@/components/auth/SignoutButton";

const layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div>
      <StudentHeader />
      {children}
      <Contacts className="text-center" />
      <SignoutButton />
    </div>
  );
};

export default layout;
