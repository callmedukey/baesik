"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { findTeachersAsAdmin } from "@/actions/admin";
import { SchoolUserSearchSchema, TeacherWithSchool } from "@/lib/definitions";
import AdminFoundTeacher from "./AdminFoundTeacher";

const AdminSchoolUserSeachContainer = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof SchoolUserSearchSchema>>({
    resolver: zodResolver(SchoolUserSearchSchema),
    defaultValues: {
      searchTerm: "",
      type: "username",
    },
  });

  const [teacherList, setTeacherList] = useState<TeacherWithSchool[]>([]);

  const handleSearch = async (
    values: z.infer<typeof SchoolUserSearchSchema>
  ) => {
    setLoading(true);
    const foundTeachers = await findTeachersAsAdmin({
      ...values,
    });

    if (!foundTeachers) {
      return alert("선생을 찾을 수 없습니다.");
    }

    if (foundTeachers && foundTeachers.length === 0) {
      return alert("선생이 없습니다.");
    }
    setTeacherList(foundTeachers as TeacherWithSchool[]);
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
                          <RadioGroupItem value="name" />
                        </FormControl>
                        <FormLabel className="font-normal">선생 성함</FormLabel>
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
      {teacherList && !teacherList.length && (
        <div className="flex items-center justify-center h-full">
          <span>검색된 선생이 없습니다.</span>
        </div>
      )}
      {teacherList && teacherList.length > 0 && (
        <section className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-3 items-center justify-center gap-2 max-w-4xl w-full mx-auto border p-2 rounded-md shadow-sm">
          {teacherList.map((teacher) => (
            <AdminFoundTeacher key={teacher.id} teacher={teacher} />
          ))}
        </section>
      )}
    </div>
  );
};

export default AdminSchoolUserSeachContainer;
