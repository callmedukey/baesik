import SchoolHeader from "@/components/admin/layout/SchoolLayout";
import React from "react";

const layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div>
      <SchoolHeader />
      {children}
    </div>
  );
};

export default layout;
