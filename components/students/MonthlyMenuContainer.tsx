"use client";
import Link from "next/link";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ko } from "date-fns/locale/ko";
import { format } from "date-fns";

const MonthlyMenuContainer = () => {
  const [findDate, setFindDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!findDate || !findDate.from || !findDate.to) {
      return alert("날짜를 선택해주세요.");
    }
    setIsLoading(true);
    setImgSrc([]);

    const response = await fetch(
      `/api/menu?fromDate=${findDate.from?.toString()}&toDate=${findDate.to?.toString()}`,
      {
        cache: "no-store",
      }
    );
    const data = await response.json();

    if (data && data?.message) {
      alert(data.message);
    }
    if (data && data?.validFiles) {
      setImgSrc(data.validFiles);
    }
    if (data?.error) {
      alert(data.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="">
      <h1 className="text-center text-2xl font-bold">메뉴 조회</h1>
      <aside className="w-full flex gap-4 my-6 mx-auto max-w-md">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !findDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {findDate?.from ? (
                findDate.to ? (
                  <>
                    {format(findDate.from, "yyyy-MM-dd")} -{" "}
                    {format(findDate.to, "yyyy-MM-dd")}
                  </>
                ) : (
                  format(findDate.from, "yyyy-MM-dd")
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
              defaultMonth={findDate?.from}
              selected={findDate}
              onSelect={setFindDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Button
          disabled={!findDate || isLoading}
          onClick={handleSearch}
          type="button"
        >
          {isLoading ? "로딩중..." : "조회하기"}
        </Button>
      </aside>

      {imgSrc.length > 0 &&
        imgSrc.map((fileName) => (
          <Link
            href={`/api/images?fileName=${fileName}`}
            target="_blank"
            key={fileName}
          >
            <img
              src={`/api/images?fileName=${fileName}`}
              alt="준비된 이미지"
              className="max-w-[90vw] w-full mx-auto object-contain max-h-[80vh] h-full"
            />
          </Link>
        ))}
    </div>
  );
};

export default MonthlyMenuContainer;
