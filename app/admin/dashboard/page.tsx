import { getSchoolsWithStudentsForMeals } from "@/actions/admin";
// import AdminConfirmMealButton from "@/components/admin/AdminConfirmMealButton";
import AdminDashboardSchoolList from "@/components/admin/AdminDashboardSchoolList";
import MainContainer from "@/components/layout/main-container";
// import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const AdminPage = async () => {
  const { todayRequests, tomorrowRequests } =
    await getSchoolsWithStudentsForMeals();
  return (
    <MainContainer hasHeader className="block space-y-4">
      <div className="border shadow-md p-2 rounded-md w-full text-center">
        <div className="text-xl font-bold text-center flex items-center justify-center gap-4">
          <span>당일 학식</span>
          {/* {todayRequests && todayRequests.length > 0 && (
            <AdminConfirmMealButton
              meals={todayRequests
                ?.flatMap((school) => school.students)
                .flatMap((student) => student.meals)
                .map((meal) => ({ id: meal.id }))}
            />
          )} */}
        </div>
        {todayRequests && todayRequests.length === 0 && (
          <div className="p-4">
            <h3 className="text-sm text-gray-500">당일 학식 없음</h3>
          </div>
        )}
        <div className="grid grid-cols sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {todayRequests &&
            todayRequests.length > 0 &&
            todayRequests.map((school) => (
              <div key={school.id} className="p-4">
                <h3 className="text-lg font-bold">{school.name}</h3>
              </div>
            ))}
        </div>
      </div>
      <div className="border shadow-md p-2 rounded-md w-full text-center">
        <div className="text-xl font-bold text-center flex items-center justify-center gap-4">
          <span>내일 학식</span>
          {/* {tomorrowRequests && tomorrowRequests.length > 0 && (
            <AdminConfirmMealButton
              meals={tomorrowRequests
                ?.flatMap((school) => school.students)
                .flatMap((student) => student.meals)
                .map((meal) => ({ id: meal.id }))}
            />
          )} */}
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
