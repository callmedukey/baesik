import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import React from "react";
import StudentLoginForm from "./StudentLoginForm";
import SchoolLoginForm from "./SchoolLoginForm";
import { Button } from "../ui/button";
import Link from "next/link";

const LoginForm = () => {
  return (
    <Card className="max-w-md mx-auto w-full shadow-md">
      <CardHeader>
        <CardTitle>로그인</CardTitle>
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
            <StudentLoginForm />
          </TabsContent>
          <TabsContent value="school">
            <SchoolLoginForm />
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
  );
};

export default LoginForm;
