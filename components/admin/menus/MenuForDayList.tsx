"use client";
import { ko } from "date-fns/locale/ko";
import * as React from "react";
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
import type { Meals } from "@prisma/client";
import { getMealForDay } from "@/actions/meals";
import { Input } from "@/components/ui/input";

const acceptedFileTypes = ["image/jpg", "image/png", "image/jpeg"];

const MenuForDayList = () => {
  const [date, setDate] = React.useState<Date>();
  const [loading, setLoading] = React.useState(false);
  const [meal, setMeal] = React.useState<Meals | null>(null);
  const [selected, setSelected] = React.useState(false);
  const [imgSrc, setImgSrc] = React.useState<string>("");
  const [toUploadImgSrc, setToUploadImgSrc] = React.useState<string>("");
  const [toUploadImg, setToUploadImg] = React.useState<File | undefined>();
  const uploadRef = React.useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    setLoading(true);
    setImgSrc("");
    if (!date) {
      return alert("날짜를 선택해주세요.");
    }
    const response = await fetch(`/api/meal?date=${date.toISOString()}`, {
      cache: "no-store",
    });
    const data = await response.blob();
    console.log(data);
    if (!acceptedFileTypes.includes(data.type)) {
      setSelected(true);
      return setLoading(false);
    }
    if (data) {
      const url = URL.createObjectURL(data);
      setImgSrc(url);
    }
    setSelected(true);
    setMeal(meal);

    setLoading(false);
  };

  const handleUpload = async () => {
    if (!toUploadImg) {
      return alert("이미지를 선택해주세요.");
    }
    if (!date) {
      return alert("날짜를 선택해주세요.");
    }
    try {
      const form = new FormData();
      form.append("file", toUploadImg);
      form.append("date", date?.toString());
      const response = await fetch("/api/meal", {
        method: "POST",
        body: form,
      });
      const data = await response.json();
      if (data.message) {
        const url = URL.createObjectURL(toUploadImg);
        setImgSrc(url);
      }
    } catch (error) {}
  };

  return (
    <section>
      <aside className="my-6 flex items-center justify-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "yyyy-MM-dd") : <span>날짜 선택</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              locale={ko}
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button
          disabled={!date || loading}
          onClick={handleSearch}
          type="button"
        >
          조회
        </Button>
      </aside>
      {imgSrc && (
        <div className="w-full">
          <img
            src={imgSrc}
            alt="업로드 이미지"
            height={600}
            width={600}
            className="object-cover"
          />
        </div>
      )}
      <div>
        {selected && (
          <div className="flex flex-col gap-4 max-w-sm w-full mx-auto">
            <Input
              type="file"
              accept={".jpg, .png, .jpeg"}
              ref={uploadRef}
              onChange={(e) => setToUploadImg(e.currentTarget.files?.[0])}
            />
            <Button type="button" onClick={handleUpload}>
              업로드
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuForDayList;
