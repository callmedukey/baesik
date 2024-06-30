import { redirect } from "next/navigation";
import React from "react";
import prisma from "@/lib/prisma";
import MainContainer from "@/components/layout/main-container";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ResetStudentPasswordFinalForm from "@/components/auth/ResetStudentPasswordFinalForm";

const page = async ({ searchParams }: { searchParams: { code: string } }) => {
  const { code } = searchParams;

  if (!code) {
    return redirect("/reset-password");
  }

  const foundCode = await prisma.studentPasswordResetCode.findFirst({
    where: {
      id: code,
    },
    include: {
      student: {
        select: {
          username: true,
        },
      },
    },
  });

  if (!foundCode) {
    return redirect("/reset-password");
  }

  return (
    <MainContainer>
      <Card className="max-w-md mx-auto w-full shadow-md">
        <CardHeader>
          <CardTitle>비밀번호 초기화</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <ResetStudentPasswordFinalForm
            username={foundCode.student.username}
          />
        </CardContent>
        <CardFooter className="block">
          <div className="grid grid-cols-2 gap-2 mt-4 text-center text-sm text-gray-500">
            <Link href="/find-id">아이디 찾기</Link>
            <Link href="/reset-password">비밀번호 초기화</Link>
          </div>
        </CardFooter>
      </Card>
    </MainContainer>
  );
};

export default page;
