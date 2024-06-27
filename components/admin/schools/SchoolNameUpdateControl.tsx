"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AddSchoolSchema } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { updateSchool } from "@/actions/admin";
import { useToast } from "@/components/ui/use-toast";

const SchoolNameUpdateControl = ({
  schoolId,
  schoolName,
  schoolUpdateOpen,
  setSchoolUpdateOpen,
}: {
  schoolId: string;
  schoolName: string;
  schoolUpdateOpen: boolean;
  setSchoolUpdateOpen: (open: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(AddSchoolSchema),
    defaultValues: {
      name: schoolName,
    },
  });

  const updateSchoolFn = async (data: z.infer<typeof AddSchoolSchema>) => {
    setLoading(true);
    const response = await updateSchool({ ...data, id: schoolId });
    if (response && response.message) {
      toast({
        title: "학원 이름 수정 성공",
        description: response.message,
        variant: "default",
      });
    }

    if (response && response.error) {
      toast({
        title: "학원 이름 수정 실패",
        description: response.error,
        variant: "destructive",
      });
    }
    setLoading(false);
  };
  return (
    <Dialog open={schoolUpdateOpen} onOpenChange={setSchoolUpdateOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>학원 이름 수정</DialogTitle>
        </DialogHeader>
        <DialogDescription>학원 이름을 수정합니다.</DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(updateSchoolFn)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>학원 이름</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-6 w-full" disabled={loading}>
              {loading ? "수정중..." : "수정"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(SchoolNameUpdateControl);
