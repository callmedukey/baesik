import MainContainer from "@/components/layout/main-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ResetStudentPasswordForm from "@/components/auth/ResetStudentPasswordForm";
import ResetSchoolPasswordForm from "@/components/auth/ResetSchoolPassordForm";

const ResetPasswordPage = () => {
  return (
    <MainContainer>
      <Card className="max-w-md mx-auto w-full shadow-md">
        <CardHeader>
          <CardTitle>비밀번호 초기화</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <Tabs defaultValue="student" className="">
            <TabsList className="w-full">
              <TabsTrigger value="student" className="w-full">
                학생
              </TabsTrigger>
              <TabsTrigger value="school" className="w-full">
                학교
              </TabsTrigger>
            </TabsList>
            <TabsContent value="student">
              <ResetStudentPasswordForm />
            </TabsContent>
            <TabsContent value="school">
              <ResetSchoolPasswordForm />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="block">
          <Button className="w-full" variant={"outline"} asChild>
            <Link href="/signup">회원가입</Link>
          </Button>
          <div className="grid grid-cols-2 gap-2 mt-4 text-center text-sm text-gray-500">
            <Link href="/find-id">아이디 찾기</Link>
            <Link href="/reset-password">비밀번호 초기화</Link>
          </div>
        </CardFooter>
      </Card>
    </MainContainer>
  );
};

export default ResetPasswordPage;
