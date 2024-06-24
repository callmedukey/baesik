"use server";
import path from "path";
import getHolidayData from "@/lib/getHolidayData";
import { existsSync } from "fs";
import { access, mkdir, readFile, writeFile } from "fs/promises";

type HolidayResponse = {
  [key: string]: string;
};

export const getHolidayDataFromApi = async (
  month?: string
): Promise<HolidayResponse | { error: string }> => {
  const currentMonth =
    new Date().getFullYear().toString() +
    "-" +
    (month || new Date().getMonth() + 1);

  const dirExists = await access(path.join(process.cwd(), "holidays"))
    .then(() => true)
    .catch(() => false);

  if (!dirExists) {
    await mkdir(path.join(process.cwd(), "holidays"));
  }

  if (
    !existsSync(
      path.join(process.cwd(), "holidays") +
        "/" +
        currentMonth.toString() +
        ".json"
    )
  ) {
    const data = await getHolidayData(new Date().getFullYear().toString());
    if ((data as any)?.error) {
      return { error: (data as any).error };
    }

    const filePath =
      path.join(process.cwd(), "holidays") +
      "/" +
      currentMonth.toString() +
      ".json";
    await writeFile(filePath, JSON.stringify(data));

    return data as HolidayResponse;
  } else {
    const filePath =
      path.join(process.cwd(), "holidays") +
      "/" +
      currentMonth.toString() +
      ".json";
    const data = await readFile(filePath, "utf-8");
    return JSON.parse(data);
  }
};
