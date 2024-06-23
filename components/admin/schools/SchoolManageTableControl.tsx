"use client";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";
import Link from "next/link";
import { deleteSchool } from "@/actions/admin";
import { useToast } from "@/components/ui/use-toast";
import SchoolNameUpdateControl from "./SchoolNameUpdateControl";

const SchoolManageTableControl = ({
  schoolId,
  schoolName,
}: {
  schoolId: string;
  schoolName: string;
}) => {
  const [open, setOpen] = useState(false);
  const [schoolUpdateOpen, setSchoolUpdateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const deleteSchoolFn = async () => {
    if (!confirm("삭제한 학교는 복구할 수 없습니다. 삭제하시겠습니까?")) {
      return;
    }
    setLoading(true);
    const response = await deleteSchool(schoolId);

    if (response && response?.message) {
      toast({
        title: "학교 삭제 성공",
        description: response.message,
      });
    }
    if (response && response?.error) {
      toast({
        title: "학교 삭제 실패",
        description: response.error,
        variant: "destructive",
      });
    }
    setLoading(false);
  };
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <DotsHorizontalIcon className="w-5 h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>관리 메뉴</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setSchoolUpdateOpen(true)}>
          이름 수정
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/admin/dashboard/schools/students">학생 명단</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={deleteSchoolFn} className="cursor-pointer">
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
      <SchoolNameUpdateControl
        schoolId={schoolId}
        schoolName={schoolName}
        schoolUpdateOpen={schoolUpdateOpen}
        setSchoolUpdateOpen={setSchoolUpdateOpen}
      />
    </DropdownMenu>
  );
};

export default SchoolManageTableControl;
