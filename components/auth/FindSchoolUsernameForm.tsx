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

import Link from "next/link";
import { FindUsernameSchema } from "@/lib/definitions";
import { findStudentUsername } from "@/actions/auth";

const FindSchoolUsernameForm = () => {
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");
  const form = useForm<z.infer<typeof FindUsernameSchema>>({
    resolver: zodResolver(FindUsernameSchema),
    defaultValues: {
      phone: "",
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FindUsernameSchema>) => {
    const { name, phone } = values;
    const { username, error } = await findStudentUsername({ name, phone });
    if (username) {
      setUsername(username);
    }
    if (error) {
      setError(error);
    }
  };
  return (
    <Form {...form}>
      {username && (
        <div className="text-center text-sm text-gray-600 border-2 py-4 mb-4 rounded-md">
          아이디: {username}
        </div>
      )}
      {error && <div className="text-center text-sm text-red-500">{error}</div>}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-sm mx-auto"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>성함</FormLabel>
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full my-6 font-bold">아이디 찾기</Button>
        <Button asChild variant={"outline"} className="w-full">
          <Link href="/login">로그인으로 이동</Link>
        </Button>
      </form>
    </Form>
  );
};

export default FindSchoolUsernameForm;
