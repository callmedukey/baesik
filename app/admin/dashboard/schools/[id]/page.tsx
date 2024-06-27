import { redirect } from "next/navigation";
import React from "react";

const SchoolsDetailPage = ({ params }: { params: { id: string } }) => {
  if (!params.id) {
    redirect("/admin/dashboard/schools");
  }

  return <div>학원 관리 페이지</div>;
};

export default SchoolsDetailPage;
