"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/definitions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { adminLogin, createAdmin } from "@/actions/auth";
import { useRouter } from "next/navigation";

const AdminLoginForm = () => {
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    const response = await adminLogin(data);
    console.log(response);
    if (response && response.error) {
      console.log(response.error);
      alert(response.error);
    }
    if (response && response.redirectTo) {
      router.push(response.redirectTo);
    }
  };

  return (
    <Form {...form}>
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="mt-6 w-full font-semibold">로그인</Button>
        <Button
          type="button"
          className="mt-6 w-full font-semibold"
          onClick={async () => {
            await createAdmin({
              username: "admin",
              password: "admin2024@",
            });
          }}
        >
          관리자 생성
        </Button>
      </form>
    </Form>
  );
};

export default AdminLoginForm;
