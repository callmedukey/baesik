import StudentHeader from "@/components/admin/layout/StudentHeader";
import SignoutButton from "@/components/auth/SignoutButton";

const layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div>
      <StudentHeader />
      {children}
      <SignoutButton />
    </div>
  );
};

export default layout;
