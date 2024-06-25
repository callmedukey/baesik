"use client";
import { PaymentSchema } from "@/lib/definitions";
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
// required fields amount, billingName, ordererName, phone
const PaymentForm = ({ totalAmount }: { totalAmount: number }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof PaymentSchema>>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      amount: totalAmount,
      billingName: "",
      ordererName: "",
      phone: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof PaymentSchema>) => {
    const res = await fetch("/api/payment", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) {
      router.push(`/student/cart/payment/final?id=${json.id}`);
    } else alert("결제 중 오류가 발생했습니다.");
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="my-6">
        <FormField
          control={form.control}
          name="ordererName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>주문자</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>결제자</FormLabel>
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
              <FormLabel>핸드폰 번호</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="mt-6 w-full font-semibold">입금 진행하기</Button>
      </form>
    </Form>
  );
};

export default PaymentForm;
