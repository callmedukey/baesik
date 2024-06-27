"use client";
import { AddSchoolToList } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { AddSchoolSchema } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const SchoolManageControlContainer = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof AddSchoolSchema>>({
    resolver: zodResolver(AddSchoolSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof AddSchoolSchema>) => {
    setLoading(true);
    const response = await AddSchoolToList(data);
    if (!response) {
      setLoading(false);
      return toast({
        title: "학원 추가 실패",
        description: "학원 추가에 실패했습니다.",
        variant: "destructive",
      });
    }
    if (response && response?.error) {
      setLoading(false);
      return toast({
        title: "학원 추가 실패",
        description: response.error,
        variant: "destructive",
      });
    }

    if (response && response?.message) {
      setLoading(false);
      return toast({
        title: "학원 추가 성공",
        description: response.message,
      });
    }
  };
  return (
    <aside className="w-full">
      <Form {...form}>
        <form
          className="flex items-center gap-2 justify-center"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="sr-only">학원 이름</FormLabel>
                <FormControl className="">
                  <Input
                    className="!mt-0 py-0 w-full"
                    {...field}
                    placeholder="추가할 학원 이름을 입력해주세요."
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button disabled={loading} className="">
            추가
          </Button>
        </form>
      </Form>
    </aside>
  );
};

export default SchoolManageControlContainer;
