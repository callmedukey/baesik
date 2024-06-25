import { getSchools } from "@/actions/admin";
import SchoolManageControlContainer from "@/components/admin/schools/SchoolManageControlContainer";
import SchoolManageTable from "@/components/admin/schools/SchoolManageTable";
import MainContainer from "@/components/layout/main-container";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const page = async () => {
  const schools = await getSchools();
  return (
    <MainContainer hasHeader className="block">
      <div className="max-w-xl mx-auto">
        <SchoolManageControlContainer />
        <Suspense fallback={<p className="text-center">로딩중....</p>}>
          {schools && <SchoolManageTable schools={schools} />}
        </Suspense>
      </div>
    </MainContainer>
  );
};

export default page;
