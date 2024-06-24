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

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { type DateRange } from "react-day-picker";
import { useToast } from "@/components/ui/use-toast";

const MenuForDayList = () => {
  const [findDate, setFindDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [validDate, setValidDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState(false);
  const [imgSrc, setImgSrc] = React.useState<string[]>([]);
  const [toUploadImg, setToUploadImg] = React.useState<File | undefined>();
  const { toast } = useToast();
  const handleSearch = async () => {
    if (!findDate || !findDate.from || !findDate.to) {
      return alert("날짜를 선택해주세요.");
    }
    setLoading(true);
    setImgSrc([]);
    setToUploadImg(undefined);
    const response = await fetch(
      `/api/menu?fromDate=${findDate.from?.toISOString()}&toDate=${findDate.to?.toISOString()}`,
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
    setSelected(true);
    setLoading(false);
  };

  const handleUpload = async () => {
    if (!toUploadImg) {
      return alert("이미지를 선택해주세요.");
    }
    if (!validDate || !validDate.from || !validDate.to) {
      return alert("날짜를 선택해주세요.");
    }
    try {
      const form = new FormData();
      form.append("file", toUploadImg);
      form.append("fromDate", validDate?.from?.toISOString());
      form.append("toDate", validDate?.to?.toISOString());
      const response = await fetch("/api/menu", {
        method: "POST",
        body: form,
      });
      const data = await response.json();
      if (data && data?.message) {
        toast({
          title: "업로드 성공",
          description: data.message,
        });
      }
      if (data?.error) {
        toast({
          title: "업로드 실패",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      alert("업로드 실패했습니다.");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setToUploadImg(undefined);
    }
  };

  const handleDelete = async (fileName: string) => {
    try {
      const response = await fetch("/api/menu", {
        method: "DELETE",
        body: JSON.stringify({ fileName }),
      });
      const data = await response.json();
      if (data?.message) {
        setImgSrc((img) => img.filter((img) => img !== fileName));
        return toast({
          title: "이미지 삭제 성공",
          description: data.message,
        });
      }
      if (data?.error) {
        return toast({
          title: "이미지 삭제 실패",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      alert("서버 오류입니다, 개발자에게 문의주세요.");
    }
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
          disabled={!findDate || loading}
          onClick={handleSearch}
          type="button"
        >
          조회
        </Button>
      </aside>
      {imgSrc && imgSrc.length > 0 && (
        <div className="w-full flex justify-center items-center flex-col gap-4">
          {imgSrc.map((img) => (
            <div className="space-y-4">
              <Link
                href={`/api/images?fileName=${img}`}
                target="_blank"
                key={img}
              >
                <img
                  src={`/api/images?fileName=${img}`}
                  alt="업로드 이미지"
                  height={600}
                  width={600}
                  className="object-cover"
                />
              </Link>
              <Button
                type="button"
                className="w-full mx-auto"
                onClick={() => handleDelete(img)}
                variant={"destructive"}
              >
                삭제
              </Button>
            </div>
          ))}
        </div>
      )}
      <div>
        {selected && (
          <div className="flex flex-col gap-4 max-w-sm w-full mx-auto">
            <div className="my-6 flex items-center justify-center gap-4">
              <p className="text-center tracking-tighter">유효일 설정</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !validDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {validDate?.from ? (
                      validDate.to ? (
                        <>
                          {format(validDate.from, "yyyy-MM-dd")} -{" "}
                          {format(validDate.to, "yyyy-MM-dd")}
                        </>
                      ) : (
                        format(validDate.from, "yyyy-MM-dd")
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
                    defaultMonth={validDate?.from}
                    selected={validDate}
                    onSelect={setValidDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Input
              type="file"
              accept={".jpg, .png, .jpeg"}
              onChange={(e) => setToUploadImg(e.currentTarget.files?.[0])}
              ref={fileInputRef}
            />
            <Button
              type="button"
              onClick={handleUpload}
              className="font-bold bg-yellow-600 hover:bg-yellow-600/60"
            >
              업로드
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuForDayList;
