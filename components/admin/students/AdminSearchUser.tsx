"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Student } from "@prisma/client";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";

import * as React from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { findStudentsAsAdmin } from "@/actions/admin";
import { StudentSearchSchema, StudentWithSchool } from "@/lib/definitions";
import AdminFoundStudent from "./AdminFoundStudent";

const AdminUserSearchContainer = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof StudentSearchSchema>>({
    resolver: zodResolver(StudentSearchSchema),
    defaultValues: {
      searchTerm: "",
      type: "username",
    },
  });

  const [studentList, setStudentList] = useState<StudentWithSchool[]>([]);

  const handleSearch = async (values: z.infer<typeof StudentSearchSchema>) => {
    setLoading(true);
    const foundStudents = await findStudentsAsAdmin({
      ...values,
    });

    if (!foundStudents) {
      alert("학생을 찾을 수 없습니다.");
    }

    if (foundStudents && foundStudents.length === 0) {
      alert("학생이 없습니다.");
    }
    setStudentList(foundStudents || []);
    setLoading(false);
  };

  return (
    <div className="w-full">
      <aside className="my-6 flex items-center justify-center gap-4">
        <Form {...form}>
          <form
            action=""
            className="space-y-4"
            onSubmit={form.handleSubmit(handleSearch)}
          >
            <FormField
              control={form.control}
              name="searchTerm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>검색어</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex items-center py-4 border-primary border-y flex-col md:flex-row gap-2 md:gap-4">
                  <FormLabel className="h-full">검색 유형</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex md:gap-6 items-center !mt-0 mx-auto [@media(max-width:365px)]:grid [@media(max-width:365px)]:grid-cols-2"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0 sm:space-x-3">
                        <FormControl>
                          <RadioGroupItem value="username" />
                        </FormControl>
                        <FormLabel className="font-normal">아이디</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="studentName" />
                        </FormControl>
                        <FormLabel className="font-normal">학생 이름</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0 sm:space-x-3">
                        <FormControl>
                          <RadioGroupItem value="studentEmail" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          학생 이메일
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0 sm:space-x-3">
                        <FormControl>
                          <RadioGroupItem value="schoolName" />
                        </FormControl>
                        <FormLabel className="font-normal">학교 이름</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full"
              disabled={!form.formState.isValid || loading}
              type="submit"
            >
              조회
            </Button>
          </form>
        </Form>
      </aside>
      {studentList && !studentList.length && (
        <div className="flex items-center justify-center h-full">
          <span>검색된 학생이 없습니다.</span>
        </div>
      )}
      {studentList && studentList.length > 0 && (
        <section className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-3 items-center justify-center gap-2 max-w-4xl w-full mx-auto border p-2 rounded-md shadow-sm">
          {studentList.map((student) => (
            <AdminFoundStudent key={student.id} student={student} />
          ))}
        </section>
      )}
    </div>
  );
};

export default AdminUserSearchContainer;
