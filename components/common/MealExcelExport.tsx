import * as FileSave from "file-saver";
import * as XLSX from "xlsx";
import { Button } from "../ui/button";

const MealExcelExport = ({
  excelData,
  filename,
}: {
  excelData: any;
  filename: string;
}) => {
  const exportExcel = async () => {
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = { Sheets: { 식사명단: ws }, SheetNames: ["식사명단"] };
    const excelBuffer = XLSX.writeFile(wb, `${filename}-식사명단.xlsx`, {
      type: "array",
      bookType: "xlsx",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
    });

    FileSave.saveAs(data, `${filename}-식사명단.xlsx`);
  };
  return (
    <div className="flex justify-end items-center gap-2 mb-6 print:hidden">
      <p className="font-semibold text-gray-600">{`점심, 저녁 식사 명단 분리된 파일 ->`}</p>
      <Button className="" variant={"outline"} onClick={exportExcel}>
        엑셀 다운로드
      </Button>
    </div>
  );
};

export default MealExcelExport;
