"use server";

import prisma from "@/lib/prisma";
import path from "path";
import { existsSync } from "fs";

export const getMenu = async ({
  fromDate,
  toDate,
}: {
  fromDate: string;
  toDate: string;
}) => {
  try {
    if (!fromDate || !toDate) {
      return { error: "조회일이 모두 선택되어야 합니다" };
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
      return { message: "해당 날짜에 메뉴가 없습니다", notReady: true };
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
    return { validFiles };
  } catch (error) {
    console.error(error);
    return { error: "파일을 찾을수 없습니다" };
  }
};
