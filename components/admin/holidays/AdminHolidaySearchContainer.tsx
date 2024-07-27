"use client";
import * as React from "react";
import { ko } from "date-fns/locale/ko";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { makeHoliday } from "@/actions/admin";

interface Holiday {
  date: Date;
}

export function AdminHolidaySearchContainer() {
  const [singleDay, setSingleDay] = React.useState<Date | undefined>(undefined);

  const [loading, setLoading] = React.useState(false);

  const [holidays, setHolidays] = React.useState<Holiday[]>([]);

  const handleSearch = async () => {
    setLoading(true);
    if (!singleDay) {
      alert("날짜를 선택해주세요.");
      setLoading(false);
      return;
    }

    const { message } = await makeHoliday(singleDay);
    alert(message);
    setLoading(false);
  };

  return (
    <section>
      <aside className="my-6 flex items-center justify-center gap-4 print:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !singleDay && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {singleDay ? (
                <>{format(singleDay, "yyyy-MM-dd")}</>
              ) : (
                <span>날짜 선택</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="single"
              locale={ko}
              selected={singleDay}
              onSelect={(day) => setSingleDay(day || undefined)}
            />
          </PopoverContent>
        </Popover>
        <Button
          disabled={!singleDay || loading}
          onClick={handleSearch}
          type="button"
        >
          신청
        </Button>
      </aside>
    </section>
  );
}
