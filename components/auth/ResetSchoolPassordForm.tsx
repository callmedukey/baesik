"use client";
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
import { useState } from "react";
import { resetSchoolPasswordFirstStep } from "@/actions/auth";
import { ResetPasswordSchema } from "@/lib/definitions";
import ResetSchoolPasswordVerificationForm from "./ResetSchoolPasswordVerificationForm";

const ResetSchoolPasswordForm = () => {
  const [error, setError] = useState<string>("");
  const [codeSent, setCodeSent] = useState<boolean>(false);

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      username: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    setError("");
    if (values.username && values.username.includes(" ")) {
      return setError("아이디는 공백을 포함할 수 없습니다.");
    }
    if (values.username && values.phone) {
      const { error } = await resetSchoolPasswordFirstStep({
        username: values.username,
        phone: values.phone,
      });
      if (error) {
        return setError(error);
      }
      setCodeSent(true);
      setError("");
    }
  };

  if (codeSent) {
    return (
      <ResetSchoolPasswordVerificationForm
        username={form.getValues("username")}
      />
    );
  }

  if (!codeSent) {
    return (
      <Form {...form}>
        {error && (
          <div className="text-center text-sm text-red-500 text-pretty">
            {error}
          </div>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>아이디</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>휴대폰 번호</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={14} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full my-6 font-bold">인증문자 발송</Button>
        </form>
      </Form>
    );
  }
};

export default ResetSchoolPasswordForm;
