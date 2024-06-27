"use client";
import { PaymentInitSchema, PaymentSchema } from "@/lib/definitions";
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
import { useRouter } from "next/navigation";
import { useState } from "react";

const PaymentForm = ({ totalAmount }: { totalAmount: number }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof PaymentInitSchema>>({
    resolver: zodResolver(PaymentInitSchema),
    defaultValues: {
      amount: totalAmount,
      billingName: "",
      ordererName: "",
      phone: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof PaymentInitSchema>) => {
    try {
      setLoading(true);
      const res = await fetch("/api/payaction", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        router.push(`/student/cart/payment/final?id=${json.id}`);
      } else alert("결제 중 오류가 발생했습니다.");
    } catch (error) {
      alert("결제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="my-6">
        <FormField
          control={form.control}
          name="ordererName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>학생 이름</FormLabel>
              <FormControl>
                <Input {...field} placeholder="예) 홍길동 학원이름X 숫자X" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="billingName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>입금자</FormLabel>
              <FormControl>
                <Input {...field} placeholder="예) 홍길동 학원이름X 숫자X" />
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
              <FormLabel>핸드폰 번호</FormLabel>
              <FormControl>
                <Input {...field} placeholder="01012345678 - 없이" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="mt-6 w-full font-semibold" disabled={loading}>
          {loading ? "입금 진행중..." : "입금 진행하기"}
        </Button>
      </form>
    </Form>
  );
};

export default PaymentForm;
