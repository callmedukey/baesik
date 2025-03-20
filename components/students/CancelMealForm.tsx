"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { sortedBankNames } from "@/lib/bankData";

const CancelMealForm = ({ selectedMeals }: { selectedMeals: Meals[] }) => {
  const form = useForm<z.infer<typeof CancelMealSchema>>({
    resolver: zodResolver(CancelMealSchema),
    defaultValues: {
      bankDetails: "",
      accountHolder: "",
      bankName: "",
    },
  });
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: z.infer<typeof CancelMealSchema>) => {
    if (selectedMeals.length === 0) {
      alert("취소할 식사가 없습니다");
      return;
    }

    if (isNaN(Number(data.bankDetails))) {
      alert("계좌번호는 숫자로만 입력해주세요");
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
          name="bankName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>은행</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="은행을 선택해주세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sortedBankNames.map((bank) => (
                    <SelectItem value={bank} key={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bankDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>환불 계좌 번호</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value.replace(/[^0-9]/g, ""));
                  }}
                />
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
