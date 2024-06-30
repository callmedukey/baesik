"use server";
import {
  FindUsernameSchema,
  LoginSchema,
  SchoolSignUpSchema,
  StudentSignUpSchema,
} from "@/lib/definitions";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { SolapiMessageService } from "solapi";
import { createSession, deleteSession } from "./session";
import { z } from "zod";
import { redirect } from "next/navigation";
import censorUsername from "@/lib/censorUsername";
import { cookies } from "next/headers";
import generateCode from "@/lib/generateCode";

export async function studentSignup(
  data: z.infer<typeof StudentSignUpSchema>
): Promise<any> {
  // 1. Validate form fields
  const validatedFields = StudentSignUpSchema.safeParse(data);

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare data for insertion into database
  const { name, email, password, phone, schoolName, username } =
    validatedFields.data;

  const removedDashPhone = phone.replace(/-/g, "");

  // 3. Check if the user's email already exists
  const existingUser = await prisma.student.findUnique({
    where: {
      email,
      username,
      phone: removedDashPhone,
    },
  });

  if (existingUser) {
    return {
      error: "이미 존재하는 이메일/아이디/전화번호 입니다.",
    };
  }

  // Hash the user's password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Find school with name and register student
  const school = await prisma.school.findUnique({
    where: {
      name: schoolName,
    },
  });

  if (!school) {
    return {
      error: "학원 이름이 올바르지 않습니다.",
    };
  }

  const registeredStudent = await prisma.student.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone: removedDashPhone,
      username,
      school: {
        connect: {
          id: school.id,
        },
      },
    },
  });

  if (!registeredStudent) {
    return {
      error: "학생 등록에 실패했습니다.",
    };
  }

  // 4. Create a session for the user
  const userId = registeredStudent.id.toString();

  await createSession({
    userId,
    schoolId: school.id.toString(),
    isStudent: true,
  });

  return {
    success: "회원가입이 완료되었습니다.",
    redirectTo: "/login",
  };
}
export async function schoolUserSignup(
  data: z.infer<typeof SchoolSignUpSchema>
): Promise<any> {
  // 1. Validate form fields
  const validatedFields = SchoolSignUpSchema.safeParse(data);

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare data for insertion into database
  const { name, email, password, phone, schoolName, username } =
    validatedFields.data;

  const removedDashPhone = phone.replace(/-/g, "");

  // 3. Register School user, they will be disabled by default till admin grants access

  // Hash the user's password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Find school with name and register school user
  const school = await prisma.school.findUnique({
    where: {
      name: schoolName,
    },
  });

  if (!school) {
    return {
      error: "학원 이름이 올바르지 않습니다.",
    };
  }

  const registeredSchoolUser = await prisma.schoolUser.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone: removedDashPhone,
      username,
      school: {
        connect: {
          id: school.id,
        },
      },
    },
  });

  if (!registeredSchoolUser) {
    return {
      error: "학원 관리자 등록에 실패했습니다.",
    };
  }

  // 4. Create a session for the user
  const userId = registeredSchoolUser.id.toString();

  await createSession({
    userId,
    schoolId: school.id.toString(),
    isStudent: false,
  });

  return {
    success: "회원가입이 완료되었습니다.",
    redirectTo: "/login",
  };
}

export async function studentLogin(
  userLogin: z.infer<typeof LoginSchema>
): Promise<any> {
  // 1. Validate form fields
  const validatedFields = LoginSchema.safeParse(userLogin);

  const errorMessage = { error: "아이디 또는 비밀번호가 올바르지 않습니다." };

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return errorMessage;
  }

  // 2. Query the database for the user with the given email
  const user = await prisma.student.findUnique({
    where: {
      username: validatedFields.data.username,
    },
  });

  // If user is not found, return early
  if (!user) {
    return errorMessage;
  }

  // 3. Compare the user's password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(
    validatedFields.data.password,
    user.password
  );

  // If the password does not match, return early
  if (!passwordMatch) {
    return errorMessage;
  }

  // 4. If login successful, create a session for the user and redirect
  const userId = user.id.toString();
  await createSession({
    userId,
    schoolId: user.schoolId,
    isStudent: true,
  });

  redirect("/student");
}
export async function schoolLogin(
  userLogin: z.infer<typeof LoginSchema>
): Promise<any> {
  // 1. Validate form fields
  const validatedFields = LoginSchema.safeParse(userLogin);

  const errorMessage = { error: "아이디 또는 비밀번호가 올바르지 않습니다." };

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return errorMessage;
  }

  // 2. Query the database for the user with the given email
  const user = await prisma.student.findUnique({
    where: {
      username: validatedFields.data.username,
    },
  });

  // If user is not found, return early
  if (!user) {
    return errorMessage;
  }

  // 3. Compare the user's password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(
    validatedFields.data.password,
    user.password
  );

  // If the password does not match, return early
  if (!passwordMatch) {
    return errorMessage;
  }

  // 4. If login successful, create a session for the user and redirect
  const userId = user.id.toString();

  await createSession({
    userId,
    schoolId: user.schoolId,
    isStudent: false,
  });

  redirect("/school");
}

export async function logout(link?: string) {
  deleteSession(link);
}

export const createAdmin = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  if (!username || !password) {
    return {
      error: "아이디 또는 비밀번호가 올바르지 않습니다.",
    };
  }

  const parsed = LoginSchema.safeParse({ username, password });

  if (!parsed.success) {
    return {
      error: "아이디 또는 비밀번호가 올바르지 않습니다.",
    };
  }

  const admin = await prisma.admin.create({
    data: {
      username: parsed.data.username,
      password: await bcrypt.hash(parsed.data.password, 10),
    },
  });

  if (admin) {
    await createSession({
      userId: admin.id.toString(),
      isAdmin: true,
    });
    return {
      success: "관리자 생성 완료",
    };
  }

  return {
    error: "관리자 생성 실패",
  };
};

export const adminLogin = async (
  adminLogin: z.infer<typeof LoginSchema>
): Promise<{ error?: string; message?: string; redirectTo?: string }> => {
  const validatedFields = LoginSchema.safeParse(adminLogin);
  const errorMessage = {
    error: "아이디 또는 비밀번호가 올바르지 않습니다.",
  };
  if (!validatedFields.success) {
    return errorMessage;
  }

  //if admin doesn't exist, first login is created automatically

  const found = await prisma.admin.findMany({
    take: 1,
  });

  if (!found?.length) {
    const response = await createAdmin({
      username: validatedFields.data.username,
      password: validatedFields.data.password,
    });

    if (response.error) {
      return {
        error: response.error,
      };
    } else {
      return {
        message: "관리자 생성 완료",
        redirectTo: "/admin/dashboard",
      };
    }
  }

  const admin = await prisma.admin.findUnique({
    where: {
      username: validatedFields.data.username,
    },
  });

  if (!admin) {
    return errorMessage;
  }

  const passwordMatch = await bcrypt.compare(
    validatedFields.data.password,
    admin.password
  );

  if (!passwordMatch) {
    return errorMessage;
  }

  await createSession({
    userId: admin.id.toString(),
    isAdmin: true,
  });

  return { message: "로그인 성공", redirectTo: "/admin/dashboard" };
};

export const findStudentUsername = async ({
  name,
  phone,
}: z.infer<typeof FindUsernameSchema>) => {
  const user = await prisma.student.findUnique({
    where: {
      name,
      phone: phone.replace(/-/g, ""),
    },
  });

  if (!user) {
    return { error: "해당하는 학생이 없습니다." };
  }

  return { username: censorUsername(user.username) };
};
export const findSchoolUsername = async ({
  name,
  phone,
}: z.infer<typeof FindUsernameSchema>) => {
  const user = await prisma.schoolUser.findUnique({
    where: {
      name,
      phone: phone.replace(/-/g, ""),
    },
  });

  if (!user) {
    return { error: "해당하는 학원 관리자가 없습니다." };
  }

  return { username: censorUsername(user.username) };
};

export const resetStudentPasswordFirstStep = async ({
  username,
  phone,
}: {
  username: string;
  phone: string;
}) => {
  try {
    const cookieStore = cookies();

    const passwordResetSent = cookieStore.get("passwordResetSent");
    if (passwordResetSent) {
      return {
        error:
          "인증번호 발송하신지 3분이 안되었습니다. 잠시 후 다시 시도해주세요.",
      };
    }

    const updated = await prisma.student.update({
      where: {
        username,
        phone: phone.replace(/-/g, ""),
      },
      data: {
        passwordResetCode: {
          upsert: {
            update: {
              code: generateCode(),
            },
            create: {
              code: generateCode(),
            },
          },
        },
      },
      select: {
        id: true,
        passwordResetCode: {
          select: {
            code: true,
          },
        },
      },
    });

    if (updated && updated.passwordResetCode) {
      const solapi = new SolapiMessageService(
        process.env.SOLAPI_API_KEY as string,
        process.env.SOLAPI_API_SECRET as string
      );

      const res = await solapi.sendOne({
        to: phone,
        from: process.env.SOLAPI_SENDER_PHONE_NUMBER as string,
        text: `준푸드 비밀번호 초기화 인증번호: [ ${updated.passwordResetCode.code} ]`,
      });

      if (res.statusCode === "2000") {
        cookieStore.set("passwordResetSent", "true", {
          path: "/",
          httpOnly: true,
          secure: true,
          maxAge: 60 * 3,
        });

        return {
          message: "인증번호 발송 완료",
        };
      } else {
        return {
          error: "인증번호 발송 오류",
        };
      }
    } else {
      return {
        error: "인증번호 발송 오류",
      };
    }
  } catch (error) {
    return {
      error: "아이디와 휴대폰 번호를 확인해주세요.",
    };
  }
};
export const resetSchoolPasswordFirstStep = async ({
  username,
  phone,
}: {
  username: string;
  phone: string;
}) => {
  try {
    const cookieStore = cookies();

    const passwordResetSent = cookieStore.get("passwordResetSent");
    if (passwordResetSent) {
      return {
        error:
          "인증번호 발송하신지 3분이 안되었습니다. 잠시 후 다시 시도해주세요.",
      };
    }

    const updated = await prisma.schoolUser.update({
      where: {
        username,
        phone: phone.replace(/-/g, ""),
      },
      data: {
        passwordResetCode: {
          upsert: {
            update: {
              code: generateCode(),
            },
            create: {
              code: generateCode(),
            },
          },
        },
      },
      select: {
        id: true,
        passwordResetCode: {
          select: {
            code: true,
          },
        },
      },
    });

    if (updated && updated.passwordResetCode) {
      const solapi = new SolapiMessageService(
        process.env.SOLAPI_API_KEY as string,
        process.env.SOLAPI_API_SECRET as string
      );

      const res = await solapi.sendOne({
        to: phone,
        from: process.env.SOLAPI_SENDER_PHONE_NUMBER as string,
        text: `준푸드 비밀번호 초기화 인증번호: [ ${updated.passwordResetCode.code} ]`,
      });

      if (res.statusCode === "2000") {
        cookieStore.set("passwordResetSent", "true", {
          path: "/",
          httpOnly: true,
          secure: true,
          maxAge: 60 * 3,
        });

        return {
          message: "인증번호 발송 완료",
        };
      } else {
        return {
          error: "인증번호 발송 오류",
        };
      }
    } else {
      return {
        error: "인증번호 발송 오류",
      };
    }
  } catch (error) {
    return {
      error: "아이디와 휴대폰 번호를 확인해주세요.",
    };
  }
};

export const resetStudentPasswordSecondStep = async ({
  code,
  username,
}: {
  code: string;
  username: string;
}) => {
  try {
    const foundCode = await prisma.studentPasswordResetCode.findUnique({
      where: {
        code,
        studentUsername: username,
      },
    });

    if (!foundCode) {
      return {
        error: "인증번호를 확인해주세요.",
      };
    }

    return {
      message: "인증번호 확인 완료",
      redirectTo: `/reset-password/student?code=${foundCode.id}`,
    };
  } catch (error) {
    return {
      error: "인증번호를 확인해주세요.",
    };
  }
};
export const resetSchoolPasswordSecondStep = async ({
  code,
  username,
}: {
  code: string;
  username: string;
}) => {
  try {
    const foundCode = await prisma.schoolPasswordResetCode.findUnique({
      where: {
        code,
        schoolUserUsername: username,
      },
    });

    if (!foundCode) {
      return {
        error: "인증번호를 확인해주세요.",
      };
    }

    return {
      message: "인증번호 확인 완료",
      redirectTo: `/reset-password/school?code=${foundCode.id}`,
    };
  } catch (error) {
    return {
      error: "인증번호를 확인해주세요.",
    };
  }
};

export const resetStudentPasswordLastStep = async ({
  password,
  confirmPassword,
  username,
}: {
  password: string;
  confirmPassword: string;
  username: string;
}) => {
  if (password !== confirmPassword) {
    return {
      error: "비밀번호가 일치하지 않습니다.",
    };
  }

  const updatedStudent = await prisma.student.update({
    where: {
      username,
    },
    data: {
      password: await bcrypt.hash(password, 10),
      passwordResetCode: {
        delete: true,
      },
    },
  });

  if (updatedStudent) {
    return {
      message: "비밀번호 초기화 완료",
      redirectTo: "/login",
    };
  } else {
    return {
      error: "비밀번호 초기화 오류",
    };
  }
};
export const resetSchoolPasswordLastStep = async ({
  password,
  confirmPassword,
  username,
}: {
  password: string;
  confirmPassword: string;
  username: string;
}) => {
  if (password !== confirmPassword) {
    return {
      error: "비밀번호가 일치하지 않습니다.",
    };
  }

  const updatedSchoolUser = await prisma.schoolUser.update({
    where: {
      username,
    },
    data: {
      password: await bcrypt.hash(password, 10),
      passwordResetCode: {
        delete: true,
      },
    },
  });

  if (updatedSchoolUser) {
    return {
      message: "비밀번호 초기화 완료",
      redirectTo: "/login",
    };
  } else {
    return {
      error: "비밀번호 초기화 오류",
    };
  }
};
