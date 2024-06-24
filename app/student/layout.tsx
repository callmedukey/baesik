import StudentHeader from "@/components/admin/layout/StudentHeader";

const layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div>
      <StudentHeader />
      {children}
    </div>
  );
};

export default layout;
