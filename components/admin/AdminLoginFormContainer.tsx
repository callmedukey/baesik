import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdminLoginForm from "./AdminLoginForm";

const AdminLoginFormContainer = () => {
  return (
    <Card className="max-w-md mx-auto w-full shadow-md">
      <CardHeader>
        <CardTitle>관리자 로그인</CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <AdminLoginForm />
      </CardContent>
    </Card>
  );
};

export default AdminLoginFormContainer;
