"use client";

import * as XLSX from "xlsx";
import { Button } from "../ui/button";

const MealExcelExport = ({
  excelData,
  filename,
}: {
  excelData: any;
  filename: string;
}) => {
  const exportExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    const wb = { Sheets: { 식사명단: ws }, SheetNames: ["식사명단"] };

    XLSX.writeFile(wb, `${filename}-식사명단.xlsx`, {
      type: "array",
      bookType: "xlsx",
    });
  };
  return (
    <div className="flex justify-end items-center gap-2 mb-6 print:hidden">
      <Button className="" variant={"outline"} onClick={exportExcel}>
        엑셀 다운로드
      </Button>
    </div>
  );
};

export default MealExcelExport;
