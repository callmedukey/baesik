"use client";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import { ResetPasswordVerificationSchema } from "@/lib/definitions";
import { resetStudentPasswordSecondStep } from "@/actions/auth";

const ResetStudentPasswordVerificationForm = ({
  username,
}: {
  username: string;
}) => {
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const form = useForm<z.infer<typeof ResetPasswordVerificationSchema>>({
    resolver: zodResolver(ResetPasswordVerificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmitCode = async (
    values: z.infer<typeof ResetPasswordVerificationSchema>
  ) => {
    setError("");

    if (!values.code) {
      return setError("인증번호를 입력해주세요.");
    }

    const { error, redirectTo } = await resetStudentPasswordSecondStep({
      code: values.code,
      username,
    });

    if (error) {
      return setError(error);
    }

    if (redirectTo) {
      router.push(redirectTo);
    }
  };

  return (
    <Form {...form}>
      {error && (
        <div className="text-center text-sm text-red-500 text-pretty">
          {error}
        </div>
      )}
      <form onSubmit={form.handleSubmit(onSubmitCode)}>
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>인증번호</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full my-6 font-bold">인증번호 확인</Button>
      </form>
    </Form>
  );
};

export default ResetStudentPasswordVerificationForm;
