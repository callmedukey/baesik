"use server";
import prisma from "@/lib/prisma";
import { verifySession } from "./session";
import { redirect } from "next/navigation";
import { AddSchoolSchema } from "@/lib/definitions";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const getSchools = async () => {
  try {
    const session = await verifySession();
    if (!session || !session.isAdmin) {
      return redirect("/admin");
    }

    const schools = await prisma.school.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });
    return schools;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const AddSchoolToList = async (
  data: z.infer<typeof AddSchoolSchema>
) => {
  try {
    const session = await verifySession();
    if (!session || !session.isAdmin) {
      return redirect("/admin");
    }

    const found = await prisma.school.findUnique({
      where: {
        name: data.name,
      },
    });

    if (found) {
      return {
        error: "이미 존재하는 학교입니다.",
      };
    }

    const school = await prisma.school.create({
      data: {
        name: data.name,
      },
    });

    if (school) {
      revalidatePath("/admin/dashboard/schools");
      return {
        message: "학교를 성공적으로 추가했습니다",
      };
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteSchool = async (schoolId: string) => {
  try {
    const session = await verifySession();
    if (!session || !session.isAdmin) {
      return redirect("/admin");
    }

    const school = await prisma.school.delete({
      where: {
        id: schoolId,
      },
    });

    if (school) {
      revalidatePath("/admin/dashboard/schools");
      return {
        message: "학교를 명단에서 삭제했습니다",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      error: "삭제 오류로 실패했습니다.",
    };
  }
};

export const updateSchool = async (
  data: z.infer<typeof AddSchoolSchema> & { id: string }
) => {
  try {
    const session = await verifySession();
    if (!session || !session.isAdmin) {
      return redirect("/admin");
    }

    const school = await prisma.school.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
      },
    });

    if (school) {
      revalidatePath("/admin/dashboard/schools");
      return {
        message: "학교 정보를 성공적으로 업데이트했습니다",
      };
    } else {
      return {
        error: "업데이트 오류로 실패했습니다.",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      error: "업데이트 오류로 실패했습니다.",
    };
  }
};
