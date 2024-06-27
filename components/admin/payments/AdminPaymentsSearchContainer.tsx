"use client";
import { PaymentSearchSchema } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Payments } from "@prisma/client";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ko } from "date-fns/locale/ko";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { findPayment } from "@/actions/admin";
import AdminPaymentContainer from "./AdminPaymentContainer";

const AdminPaymentsSearchContainer = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof PaymentSearchSchema>>({
    resolver: zodResolver(PaymentSearchSchema),
    defaultValues: {
      searchTerm: "",
      type: "payer",
    },
  });

  const [searchDate, setSearchDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const [payments, setPayments] = useState<Payments[]>([]);

  const handleSearch = async (values: z.infer<typeof PaymentSearchSchema>) => {
    if (!searchDate || !searchDate.from || !searchDate.to) {
      alert("날짜를 선택해주세요.");
      return;
    }

    setLoading(true);
    const payments = await findPayment({
      ...values,
      searchDate,
    });

    if (!payments) {
      alert("결제 내역을 조회할 수 없습니다.");
    }

    if (payments && payments.length === 0) {
      alert("결제 내역이 없습니다.");
    }
    setPayments(payments || []);
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
                          <RadioGroupItem value="payer" />
                        </FormControl>
                        <FormLabel className="font-normal">입금자</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="school" />
                        </FormControl>
                        <FormLabel className="font-normal">학원</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0 sm:space-x-3">
                        <FormControl>
                          <RadioGroupItem value="student" />
                        </FormControl>
                        <FormLabel className="font-normal">학생</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-center text-left font-normal",
                      !searchDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchDate?.from ? (
                      searchDate.to ? (
                        <>
                          {format(searchDate.from, "yyyy-MM-dd")} -{" "}
                          {format(searchDate.to, "yyyy-MM-dd")}
                        </>
                      ) : (
                        format(searchDate.from, "yyyy-MM-dd")
                      )
                    ) : (
                      <span>날짜 선택</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    locale={ko}
                    defaultMonth={searchDate?.from}
                    selected={searchDate}
                    onSelect={setSearchDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              className="w-full"
              disabled={!searchDate || loading}
              type="submit"
            >
              조회
            </Button>
          </form>
        </Form>
      </aside>
      {payments && !payments.length && (
        <div className="flex items-center justify-center h-full">
          <span>검색된 결제 내역이 없습니다.</span>
        </div>
      )}
      {payments && payments.length > 0 && (
        <section className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-3 items-center justify-center gap-2 max-w-4xl w-full mx-auto border p-2 rounded-md shadow-sm">
          {payments.map((payment) => (
            <AdminPaymentContainer
              key={payment.id}
              payment={payment}
              payments={payments}
              setPayments={setPayments}
            />
          ))}
        </section>
      )}
    </div>
  );
};

export default AdminPaymentsSearchContainer;
