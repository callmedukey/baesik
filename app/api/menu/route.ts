import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { existsSync } from "fs";
import path from "path";
import { unlink, writeFile } from "fs/promises";
import { verifySession } from "@/actions/session";
import { renameFileWithExtension } from "@/lib/renameFile";
import { addDays, differenceInDays } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    if (!fromDate || !toDate) {
      return Response.json({ error: "조회일이 모두 선택되어야 합니다" });
    }

    const found = await prisma.menu.findMany({
      where: {
        date: {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        },
      },
    });

    if (found.length === 0) {
      return Response.json({ message: "해당 날짜에 메뉴가 없습니다" });
    }
    const uniqueFileNames = Array.from(
      new Set(found.map((menu) => menu.fileName))
    ).filter((fileName) => typeof fileName === "string");

    const validFiles = [];
    if (uniqueFileNames.length > 0) {
      for (const fileName of uniqueFileNames) {
        if (existsSync(path.join(process.cwd(), "uploads") + "/" + fileName)) {
          validFiles.push(fileName);
        }
      }
    }
    return Response.json({ validFiles });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "파일을 찾을수 없습니다" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await verifySession();
    if (!session || !session.isAdmin) {
      return Response.json({ error: "Unauthorized" });
    }

    const formData = await req.formData();

    const file: File | undefined = formData.get("file") as File | undefined;
    const fromDate = formData.get("fromDate") as string;
    const toDate = formData.get("toDate") as string;

    if (!file) {
      return Response.json({ error: "파일이 없습니다" });
    }
    console.log(fromDate, toDate);
    const diff = differenceInDays(new Date(toDate), new Date(fromDate)) + 1;
    console.log(diff);
    const array = Array.from({ length: diff }, (v, i) => i + 1);

    const promiseArray = array.map((_, i) =>
      prisma.menu.upsert({
        where: {
          date: addDays(new Date(fromDate), i),
        },
        update: {
          date: addDays(new Date(fromDate), i),
        },
        create: {
          date: addDays(new Date(fromDate), i),
        },
      })
    );

    const result = await prisma.$transaction(promiseArray);

    if (result && Array.isArray(result) && result.length === array.length) {
      const newFileName = renameFileWithExtension(
        file.name,
        result[0].id.toString()
      );
      const buffer = Buffer.from(await file.arrayBuffer());
      const newFilePath =
        path.join(process.cwd(), "uploads") + "/" + newFileName;

      const [updated] = await Promise.all([
        prisma.menu.updateMany({
          where: {
            date: {
              in: array.map((_, i) => addDays(new Date(fromDate), i)),
            },
          },
          data: {
            fileName: newFileName,
          },
        }),
        writeFile(newFilePath, buffer),
      ]);
      console.log(updated);
      if (updated && updated.count === array.length) {
        return Response.json({ message: "성공적으로 업로드 되었습니다" });
      }
    } else {
      return Response.json({ error: "업로드에 문제가 생겼습니다" });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "업로드에 실패하였습니다" });
  }
}

export const DELETE = async (req: NextRequest) => {
  try {
    const session = await verifySession();
    if (!session || !session.isAdmin) {
      return Response.json({ error: "Unauthorized" });
    }
    const body: { fileName: string } = await req.json();

    const filePath = path.join(process.cwd(), "uploads") + "/" + body.fileName;

    if (existsSync(filePath)) {
      const [deleted] = await Promise.all([
        prisma.menu.deleteMany({
          where: { fileName: body.fileName },
        }),
        unlink(filePath),
      ]);
      if (deleted && deleted.count > 0) {
        return Response.json({ message: "성공적으로 삭제 되었습니다" });
      }
    } else {
      return Response.json({ error: "파일이 없습니다" });
    }
  } catch (error) {
    console.error(error);
    return Response.json({ error: "삭제에 실패하였습니다" });
  }
};
