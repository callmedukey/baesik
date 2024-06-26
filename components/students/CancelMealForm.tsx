"use client";

import { CancelMealSchema } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import type { Meals } from "@prisma/client";
import { useState } from "react";
import { cancelMeals } from "@/actions/students";
import { useRouter } from "next/navigation";

const CancelMealForm = ({ selectedMeals }: { selectedMeals: Meals[] }) => {
  const form = useForm<z.infer<typeof CancelMealSchema>>({
    resolver: zodResolver(CancelMealSchema),
    defaultValues: {
      bankDetails: "",
      accountHolder: "",
    },
  });
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: z.infer<typeof CancelMealSchema>) => {
    if (selectedMeals.length === 0) {
      alert("취소할 식사가 없습니다");
      return;
    }
    try {
      setLoading(true);

      const result = await cancelMeals({ meals: selectedMeals, ...data });

      if (result?.error) {
        alert(result.error);
      }
      if (result?.message) {
        alert(result.message);
        router.push("/student");
      }
    } catch (error) {
      console.log(error);
      alert("오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="accountHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>예금주</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bankDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>환불 계좌</FormLabel>
              <FormControl>
                <Input {...field} placeholder="카카오뱅크 3333-33-3333333" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="my-6 w-full" disabled={loading}>
          {loading ? "환불 신청중..." : "환불 신청"}
        </Button>
      </form>
    </Form>
  );
};

export default CancelMealForm;
