import { getSchoolsWithStudentsForMeals } from "@/actions/admin";
// import AdminConfirmMealButton from "@/components/admin/AdminConfirmMealButton";
import AdminDashboardSchoolList from "@/components/admin/AdminDashboardSchoolList";
import MainContainer from "@/components/layout/main-container";
import { addDays, format } from "date-fns";
import { ko } from "date-fns/locale/ko";
// import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const AdminPage = async () => {
  const { todayRequests, tomorrowRequests } =
    await getSchoolsWithStudentsForMeals();
  return (
    <MainContainer hasHeader className="block space-y-4">
      <div className="border shadow-md p-2 rounded-md w-full text-center">
        <div className="text-xl font-bold text-center flex items-center justify-center gap-2 flex-col mb-2">
          <span>당일 식사</span>
          <span className="text-base font-normal text-gray-500">
            {format(new Date(), "yyyy-MM-dd", { locale: ko })}{" "}
            {format(new Date(), "EEEE", { locale: ko })}
          </span>
        </div>
        {todayRequests && todayRequests.length === 0 && (
          <div className="p-4">
            <h3 className="text-sm text-gray-500">당일 학식 없음</h3>
          </div>
        )}
        {todayRequests && todayRequests.length > 0 && (
          <AdminDashboardSchoolList schools={todayRequests} />
        )}
      </div>
      <div className="border shadow-md p-2 rounded-md w-full text-center">
        <div className="text-xl font-bold text-center flex items-center justify-center gap-2 flex-col mb-2">
          <span>내일 식사</span>
          <span className="text-base font-normal text-gray-500">
            {format(addDays(new Date(), 1), "yyyy-MM-dd", { locale: ko })}{" "}
            {format(addDays(new Date(), 1), "EEEE", { locale: ko })}
          </span>
        </div>
        {tomorrowRequests && tomorrowRequests.length === 0 && (
          <div className="p-4">
            <h3 className="text-sm text-gray-500">내일 학식 없음</h3>
          </div>
        )}
        {tomorrowRequests && tomorrowRequests.length > 0 && (
          <AdminDashboardSchoolList schools={tomorrowRequests} />
        )}
      </div>
    </MainContainer>
  );
};

export default AdminPage;
