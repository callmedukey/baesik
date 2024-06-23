import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { existsSync } from "fs";
import path from "path";
import { readFile, writeFile } from "fs/promises";
import { verifySession } from "@/actions/session";
import { getFileExtention, renameFileWithExtension } from "@/lib/renameFile";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const date = searchParams.get("date");

    if (!date) {
      return Response.json({ error: "File name is required" });
    }
    const found = await prisma.menu.findFirst({
      where: {
        date,
      },
    });

    // return await prisma.menu.delete({
    //   where: {
    //     id: found?.id,
    //   },
    // });

    if (found && found.fileName) {
      if (
        !existsSync(path.join(process.cwd(), "uploads") + "/" + found.fileName)
      ) {
        return Response.json({ error: "File not found" });
      }
      const file = await readFile(
        path.join(process.cwd(), "uploads") + "/" + found.fileName
      );

      return new Response(file, {
        headers: {
          "Content-Type": `image/${getFileExtention(found.fileName as string)}`,
        },
      });
    } else {
      return Response.json({ error: "파일을 찾을수 없습니다" });
    }
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
    const menuDate = formData.get("date") as string;

    const createdMenu = await prisma.menu.create({
      data: {
        date: new Date(menuDate),
      },
    });

    if (createdMenu && file) {
      const newFileName = renameFileWithExtension(
        file.name,
        createdMenu.id.toString()
      );

      const buffer = Buffer.from(await file.arrayBuffer());

      const newFilePath =
        path.join(process.cwd(), "uploads") + "/" + newFileName;

      await writeFile(newFilePath, buffer);
      const updated = await prisma.menu.update({
        where: { id: createdMenu.id },
        data: { fileName: newFileName },
      });

      if (updated) {
        return Response.json({ message: "성공적으로 업로드 되었습니다" });
      } else {
        await prisma.menu.delete({
          where: { id: createdMenu.id },
        });
        return Response.json({ error: "업로드에 실패하였습니다" });
      }
    }
    return Response.json({ error: "업로드에 실패하였습니다" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "업로드에 실패하였습니다" });
  }
}
