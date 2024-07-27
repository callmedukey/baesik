"use server";
import path from "path";
import getHolidayData from "@/lib/getHolidayData";
import { existsSync } from "fs";
import { access, mkdir, readFile, writeFile } from "fs/promises";
import { verifySession } from "./session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

export const makePost = async ({
  content,
  title,
  isPrivate,
  isAdmin,
  isPinned,
  isSchool,
}: {
  content: string;
  title: string;
  isPrivate: boolean;
  isAdmin: boolean;
  isPinned: boolean;
  isSchool: boolean;
}) => {
  const session = await verifySession();
  if (!session) {
    redirect("/login");
  }
  try {
    const response = await prisma.$transaction(async (tx) => {
      if (isAdmin) {
        const admin = await tx.admin.findUnique({
          where: {
            id: session.userId,
          },
        });
        if (!admin) return null;

        const createdPost = await tx.posts.create({
          data: {
            content,
            adminId: session.userId,
            name: "관리자",
            title,
            isPinned: isPinned || false,
            isAdmin: true,
          },
        });

        if (createdPost) return { message: "게시글이 생성되었습니다" };
        return { error: "게시글이 생성되지 않았습니다" };
      }

      if (isSchool) {
        const schoolUser = await tx.schoolUser.findUnique({
          where: {
            id: session.userId,
          },
        });

        if (!schoolUser) return null;

        const createdPost = await tx.posts.create({
          data: {
            content,
            schoolUserId: session.userId,
            name: schoolUser?.name || "",
            title,
            isAnonymous: isPrivate || false,
          },
        });

        if (createdPost) return { message: "게시글이 생성되었습니다" };
        return { error: "게시글이 생성되지 않았습니다" };
      }

      if (!isAdmin && !isSchool) {
        const student = await tx.student.findUnique({
          where: {
            id: session.userId,
          },
        });

        if (!student) return null;

        const createdPost = await tx.posts.create({
          data: {
            content,
            studentId: session.userId,
            name: student?.name || "",
            title,
            isAnonymous: isPrivate,
          },
        });

        if (createdPost) return { message: "게시글이 생성되었습니다" };

        return { error: "게시글이 생성되지 않았습니다" };
      }
    });

    if (response?.message) {
      revalidatePath("/student/board");
      revalidatePath("/admin/dashboard/board");
      revalidatePath("/school/board");
      return { message: response.message };
    }
    return { error: "게시글이 생성되지 않았습니다" };
  } catch (error) {
    console.error(error);
    return { error: "게시글이 생성되지 않았습니다" };
  }
};

export const getBoardPost = async (postId: string, isAdmin = false) => {
  const post = await prisma.posts.findUnique({
    where: {
      id: postId,
    },
    include: {
      comments: {
        include: {
          admin: true,
          schoolUser: true,
          student: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (post?.isAnonymous && !isAdmin) {
    return { ...post, name: "익명" };
  }

  return post;
};

export const deletePost = async (postId: string) => {
  const session = await verifySession();
  if (!session) {
    redirect("/login");
  }

  const post = await prisma.posts.delete({
    where: {
      id: postId,
    },
  });

  if (post) {
    revalidatePath("/student/board");
    revalidatePath("/admin/dashboard/board");
    revalidatePath("/school/board");
    revalidatePath(`/student/board/${postId}`);
    revalidatePath(`/admin/dashboard/board/${postId}`);
    revalidatePath(`/school/board/${postId}`);
    return { message: "게시글이 삭제되었습니다" };
  }
  return { error: "게시글이 삭제되지 않았습니다" };
};

export const postComment = async ({
  postId,
  comment,
  isAdmin = false,
  isSchool = false,
}: {
  postId: string;
  comment: string;
  isAdmin?: boolean;
  isSchool?: boolean;
}) => {
  const session = await verifySession();
  if (!session) {
    redirect("/login");
  }

  let createdComment;

  if (isAdmin) {
    createdComment = await prisma.comments.create({
      data: {
        content: comment,
        postId,
        adminId: session.userId,
      },
    });
  }

  if (isSchool) {
    createdComment = await prisma.comments.create({
      data: {
        content: comment,
        postId,
        schoolUserId: session.userId,
      },
    });
  }

  if (!isAdmin && !isSchool) {
    createdComment = await prisma.comments.create({
      data: {
        content: comment,
        postId,
        studentId: session.userId,
      },
    });
  }

  if (createdComment) {
    revalidatePath(`/student/board/${postId}`);
    revalidatePath(`/admin/dashboard/board/${postId}`);
    revalidatePath(`/school/board/${postId}`);
    return { message: "댓글이 생성되었습니다", success: true };
  }

  return { error: "댓글이 생성되지 않았습니다", success: false };
};

export const deleteComment = async (commentId: string) => {
  const session = await verifySession();
  if (!session) {
    redirect("/login");
  }

  const comment = await prisma.comments.delete({
    where: {
      id: commentId,
    },
  });

  if (comment) {
    revalidatePath(`/student/board/${comment.postId}`);
    revalidatePath(`/admin/dashboard/board/${comment.postId}`);
    revalidatePath(`/school/board/${comment.postId}`);
    return { message: "댓글이 삭제되었습니다", success: true };
  }
  return { error: "댓글이 삭제되지 않았습니다", success: false };
};

export const getCustomHolidays = async () => {
  const session = await verifySession();
  if (!session) {
    redirect("/login");
  }

  return await prisma.holidays.findMany({
    where: {
      date: {
        gte: new Date(),
      },
    },
  });
};
