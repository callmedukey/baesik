"use client";
import {
  StudentWithSchool,
  TeacherWithSchool,
  UpdateStudentPasswordSchema,
  UpdateStudentSchema,
  UpdateTeacherPasswordSchema,
  UpdateTeacherSchema,
} from "@/lib/definitions";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { School } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateStudent,
  updateStudentPassword,
  updateTeacher,
  updateTeacherPassword,
} from "@/actions/admin";

const AdminSingleTeacherContainer = ({
  teacher,
  schools,
}: {
  teacher: TeacherWithSchool;
  schools: School[];
}) => {
  const form = useForm<z.infer<typeof UpdateTeacherSchema>>({
    resolver: zodResolver(UpdateTeacherSchema),
    defaultValues: {
      id: teacher.id,
      name: teacher.name,
      phone: teacher.phone,
      email: teacher.email,
      username: teacher.username,
      schoolName: teacher.school.name,
    },
  });

  const pwForm = useForm<z.infer<typeof UpdateTeacherPasswordSchema>>({
    resolver: zodResolver(UpdateTeacherPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      id: teacher.id,
    },
  });

  const onSubmit = async (data: z.infer<typeof UpdateStudentSchema>) => {
    const response = await updateTeacher(data);

    if (response.error) {
      return alert(response.error);
    }
    if (response.message) {
      return alert(response.message);
    }
  };
  const onPwSubmit = async (
    data: z.infer<typeof UpdateStudentPasswordSchema>
  ) => {
    if (data.password !== data.confirmPassword) {
      return alert("비밀번호가 일치하지 않습니다");
    }

    const response = await updateTeacherPassword(data);
    if (response.error) {
      return alert(response.error);
    }
    if (response.message) {
      pwForm.reset();
      return alert(response.message);
    }
  };
  return (
    <section className="w-full max-w-md mx-auto py-12 space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>아이디</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="예) biology101"
                    disabled={true}
                  />
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
                <FormLabel>전화번호</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="01012345678 - 없이 입력" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="예) biology101@gmail.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="schoolName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>학원</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="학원를 선택해주세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem value={school.name} key={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full my-6">수정하기</Button>
        </form>
      </Form>
      <Form {...pwForm}>
        <form onSubmit={pwForm.handleSubmit(onPwSubmit)}>
          <FormField
            control={pwForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>새로운 비밀번호</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={pwForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호 확인</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full my-6" variant={"outline"}>
            비밀번호 변경하기
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default AdminSingleTeacherContainer;
