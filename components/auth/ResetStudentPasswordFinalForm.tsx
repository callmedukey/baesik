"use client";
import { ResetPasswordFinalSchema } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { resetStudentPasswordLastStep } from "@/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
const ResetStudentPasswordFinalForm = ({ username }: { username: string }) => {
  const searchParams = useSearchParams();
  const codeId = searchParams.get("code");
  const router = useRouter();
  const form = useForm<z.infer<typeof ResetPasswordFinalSchema>>({
    resolver: zodResolver(ResetPasswordFinalSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ResetPasswordFinalSchema>) => {
    if (data.password !== data.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!codeId) {
      alert("잘못된 접근입니다.");
      return;
    }

    const response = await resetStudentPasswordLastStep({
      ...data,
      username,
    });

    if (response?.error) {
      return alert(response.error);
    }

    if (response?.message) {
      alert(response.message);
      router.replace("/login");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>새로운 비밀번호</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호 확인</FormLabel>
              <FormControl>
                <Input type="password" {...field} maxLength={20} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full my-6 font-bold">비밀번호 변경</Button>
      </form>
    </Form>
  );
};

export default ResetStudentPasswordFinalForm;
