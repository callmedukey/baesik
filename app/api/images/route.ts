import { getFileExtention } from "@/lib/renameFile";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import type { NextRequest } from "next/server";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const fileName = searchParams.get("fileName");

    if (!existsSync(path.join(process.cwd(), "uploads") + "/" + fileName)) {
      return Response.json({ message: "File not found" }, { status: 404 });
    }

    const file = await readFile(
      path.join(process.cwd(), "uploads") + "/" + fileName
    );
    if (file) {
      return new Response(file, {
        headers: {
          "Content-Type": `image/${getFileExtention(fileName as string)}`,
        },
      });
    } else {
      return Response.json({ message: "File not found" }, { status: 404 });
    }
  } catch (error) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
