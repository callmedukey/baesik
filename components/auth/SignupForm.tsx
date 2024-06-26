import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import React from "react";

import StudentSignupForm from "./StudentSignupForm";
import SchoolSignupForm from "./SchoolSignupForm";
import { Button } from "../ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SignupForm = async () => {
  const schools = await prisma.school.findMany();

  return (
    <Card className="max-w-md mx-auto w-full shadow-md">
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
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
            <StudentSignupForm schools={schools} />
          </TabsContent>
          <TabsContent value="school">
            <SchoolSignupForm schools={schools} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant={"outline"}>
          <Link href="/login">로그인으로 이동</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
