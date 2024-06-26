import SchoolHeader from "@/components/admin/layout/SchoolHeader";
import SignoutButton from "@/components/auth/SignoutButton";
import React from "react";

const layout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="">
      <SchoolHeader />
      {children}
      <SignoutButton />
    </div>
  );
};

export default layout;
