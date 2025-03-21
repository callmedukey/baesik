"use client";
import XLSX from "xlsx";

import {
  type RefundRequestWithStudent,
  RefundSearchSchema,
} from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { applyRefunds, getRefundRequests } from "@/actions/admin";
import AdminRefundsContainer from "./AdminRefundsContainer";
import { BankKey, bankNameToCode } from "@/lib/bankData";

const AdminRefundsSearchContainer = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof RefundSearchSchema>>({
    resolver: zodResolver(RefundSearchSchema),
    defaultValues: {
      searchTerm: "",
      type: "accountHolder",
    },
  });

  const [searchDate, setSearchDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const [refundRequests, setRefundRequests] = useState<
    RefundRequestWithStudent[]
  >([]);

  const handleSearch = async (values: z.infer<typeof RefundSearchSchema>) => {
    if (!searchDate || !searchDate.from || !searchDate.to) {
      alert("날짜를 선택해주세요.");
      return;
    }

    setLoading(true);
    const refunds = await getRefundRequests({
      ...values,
      searchDate,
    });

    if (refunds === null) {
      alert("조회 중 오류가 발생했습니다.");
    }

    if (refunds && refunds.length === 0) {
      alert("검색 결과가 없습니다.");
    }
    setRefundRequests(refunds || []);
    setLoading(false);
  };

  const handleDownload = async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    if (
      !refundRequests.length ||
      !searchDate ||
      !searchDate.from ||
      !searchDate.to
    ) {
      alert("검색된 환불건이 없습니다.");
      return;
    }
    const fileName = `환불_${format(searchDate.from, "yyyy-MM-dd")}_${format(
      searchDate.to,
      "yyyy-MM-dd"
    )}.xls`;
    const data: string[][] = [];

    refundRequests
      .filter((refund) => refund.complete === false)
      .forEach((refundRequest) => {
        data.push([
          bankNameToCode(refundRequest.bankName as BankKey),
          refundRequest.bankDetails.trim(),
          refundRequest.amount.toString(),
          refundRequest.accountHolder.trim(),
          `${refundRequest.student.name} 식사 환불`,
          `${refundRequest.student.name} 식사 환불`,
        ]);
      });

    const book = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(book, sheet, "sheet1");
    XLSX.writeFile(book, fileName);
    setLoading(false);
  };

  const handleApply = async () => {
    if (loading) {
      return;
    }
    if (!refundRequests.length) {
      alert("검색된 환불 요청이 없습니다.");
      return;
    }
    if (
      !confirm(
        "전체 환불 적용하시겠습니까? \n전체 환불 적용 후 되돌릴 수 없습니다."
      )
    ) {
      return;
    }

    setLoading(true);

    const result = await applyRefunds(
      refundRequests
        .filter((refund) => refund.complete === false)
        .map((refund) => refund.id)
    );
    if (result.message) {
      alert(result.message);
    }

    if (result.success) {
      setRefundRequests(
        refundRequests.map((refund) => ({
          ...refund,
          complete: true,
        }))
      );
    }
    setLoading(false);
  };

  return (
    <div className="w-full ">
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
                          <RadioGroupItem value="accountHolder" />
                        </FormControl>
                        <FormLabel className="font-normal">예금주</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0 sm:space-x-3">
                        <FormControl>
                          <RadioGroupItem value="bank" />
                        </FormControl>
                        <FormLabel className="font-normal">은행</FormLabel>
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
            <Button
              variant={"outline"}
              className="w-full"
              disabled={!searchDate || loading || !refundRequests.length}
              type="button"
              onClick={handleDownload}
            >
              전체 엑셀 다운로드
            </Button>
            <Button
              variant={"outline"}
              className="w-full"
              disabled={!searchDate || loading || !refundRequests.length}
              type="button"
              onClick={handleApply}
            >
              전체 환불 적용
            </Button>
          </form>
        </Form>
      </aside>
      {refundRequests && !refundRequests.length && (
        <div className="flex items-center justify-center h-full">
          <span>검색된 환불 요청이 없습니다.</span>
        </div>
      )}
      {refundRequests && refundRequests.length > 0 && (
        <section className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-3 items-center justify-center gap-2 max-w-4xl w-full mx-auto border p-2 rounded-md shadow-sm">
          {refundRequests.map((refundRequest) => (
            <AdminRefundsContainer
              key={refundRequest.id}
              refundRequest={refundRequest}
              refundRequests={refundRequests}
              setRefundRequests={setRefundRequests}
            />
          ))}
        </section>
      )}
    </div>
  );
};

export default AdminRefundsSearchContainer;
