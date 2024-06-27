import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { School } from "@prisma/client";
import SchoolManageTableControl from "./SchoolManageTableControl";

interface SchoolWithStudentCount extends School {
  _count: {
    students: number;
  };
}

const SchoolManageTable = ({
  schools,
}: {
  schools: SchoolWithStudentCount[];
}) => {
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow className="">
          <TableHead className="w-3/5 text-center">학원이름</TableHead>
          <TableHead className="w-1/5 text-center">학생수</TableHead>
          <TableHead className="w-1/5 text-center"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-center">
        {schools.length > 0 &&
          schools.map((school) => (
            <TableRow key={school.id}>
              <TableCell>{school.name}</TableCell>
              <TableCell>{school._count.students}</TableCell>
              <TableCell className="text-right">
                <SchoolManageTableControl
                  schoolId={school.id}
                  schoolName={school.name}
                />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default SchoolManageTable;
