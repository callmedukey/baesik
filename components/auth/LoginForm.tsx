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
      <CardFooter>{/* buttons go here */}</CardFooter>
    </Card>
  );
};

export default LoginForm;
