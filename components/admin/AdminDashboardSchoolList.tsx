import { SchoolsWithStudentsWithMeals } from "@/lib/definitions";
import AdminDashboardSchoolListItem from "./AdminDashboardSchoolListItem";
const AdminDashboardSchoolList = ({
  schools,
}: {
  schools: SchoolsWithStudentsWithMeals[];
}) => {
  return (
    <div className="grid grid-cols sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {schools.map((school) => (
        <AdminDashboardSchoolListItem key={school.id} school={school} />
      ))}
    </div>
  );
};

export default AdminDashboardSchoolList;
