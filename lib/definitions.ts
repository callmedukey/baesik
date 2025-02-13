import { z } from "zod";
import testValidPhoneNumber from "./regex/testPhoneNumber";
import testAlphabetsAndNumbers from "./regex/testAlphabetsAndNumbers";
import { testBankDetails } from "./testBankDetails";
import type {
  Meals,
  Payments,
  RefundRequest,
  School,
  SchoolUser,
  Student,
} from "@prisma/client";
import { testName, testKoreanName } from "./regex/testName";
import testBankAccountNumber from "./regex/testBankAccountNumber";

export interface StudentsWithMeals extends Student {
  meals: Meals[];
}

export interface MealsWithPayments extends Meals {
  payments: Payments;
}

export interface SchoolsWithStudentsWithMeals extends School {
  students: StudentsWithMeals[];
}

export interface StudentWithSchool extends Student {
  school: School;
}
export interface RefundRequestWithStudent extends RefundRequest {
  student: StudentWithSchool;
}

export interface TeacherWithSchool extends SchoolUser {
  school: School;
}

export const StudentSignUpSchema = z.object({
  name: z
    .string({ required_error: "이름을 입력해주세요." })
    .min(2, { message: "이름을 입력해주세요." })
    .refine((val) => testName(val), {
      message: "이름을 입력해주세요.",
    }),
  username: z
    .string()
    .min(4, { message: "아이디는 최소 4자 최대 14자 입니다." })
    .max(14, { message: "아이디는 최소 4자 최대 14자 입니다." })
    .refine((val) => testAlphabetsAndNumbers(val), {
      message: "아이디는 영문자와 숫자만 포함되어야 합니다.",
    }),
  email: z
    .string({ required_error: "이메일을 입력해주세요." })
    .email({ message: "올바른 이메일을 입력해주세요." })
    .trim(),
  password: z
    .string({ required_error: "비밀번호를 입력해주세요." })
    .min(8, { message: "비밀번호는 최소 8자 이상입니다." })
    .regex(/[a-zA-Z]/, { message: "비밀번호에 영문자가 포함되어야 합니다." })
    .regex(/[0-9]/, { message: "비밀번호에 숫자가 포함되어야 합니다." })
    .trim(),
  confirmPassword: z
    .string({ required_error: "비밀번호를 입력해주세요." })
    .min(8, { message: "비밀번호는 최소 8자 이상입니다." })
    .regex(/[a-zA-Z]/, { message: "비밀번호에 영문자가 포함되어야 합니다." })
    .regex(/[0-9]/, { message: "비밀번호에 숫자가 포함되어야 합니다." })
    .trim(),
  phone: z
    .string({ required_error: "핸드폰 번호를 입력해주세요." })
    .min(11, { message: "핸드폰 번호를 입력해주세요." })
    .refine((val) => testValidPhoneNumber(val), {
      message: "올바른 핸드폰 번호를 입력해주세요.",
    }),
  schoolName: z.string({ required_error: "학원를 선택해주세요." }),
});

export const UpdateStudentSchema = StudentSignUpSchema.omit({
  password: true,
  confirmPassword: true,
}).extend({
  id: z.string(),
});

export const UpdateStudentPasswordSchema = StudentSignUpSchema.pick({
  password: true,
  confirmPassword: true,
}).extend({
  id: z.string(),
});

export const UpdateTeacherSchema = StudentSignUpSchema.omit({
  password: true,
  confirmPassword: true,
}).extend({
  id: z.string(),
});

export const UpdateTeacherPasswordSchema = StudentSignUpSchema.pick({
  password: true,
  confirmPassword: true,
}).extend({
  id: z.string(),
});

export const SchoolSignUpSchema = StudentSignUpSchema.extend({
  phone: z
    .string({ required_error: "담당자 핸드폰 번호를 입력해주세요." })
    .min(11, { message: "담당자 핸드폰 번호를 입력해주세요." })
    .refine((val) => testValidPhoneNumber(val), {
      message: "올바른 담당자 핸드폰 번호를 입력해주세요.",
    }),
  email: z
    .string({ required_error: "담당자 이메일을 입력해주세요." })
    .email({ message: "올바른 담당자 이메일을 입력해주세요." }),
});

export const LoginSchema = StudentSignUpSchema.pick({
  username: true,
  password: true,
});

export const AddSchoolSchema = SchoolSignUpSchema.pick({
  name: true,
});

export const MealSchema = z.object({
  mealType: z.enum(["LUNCH", "DINNER"], {
    required_error: "식사 유형을 선택해주세요.",
  }),
  date: z.date({ required_error: "날짜를 선택해주세요." }),
});

export const MealSchemaArraySchema = z.array(MealSchema);

export const PaymentSchema = z.object({
  amount: z.number(),
  orderDate: z.string(),
  billingName: z
    .string()
    .min(1, { message: "입금자 이름을 입력해주세요." })
    .refine((val) => testKoreanName(val), {
      message: "한글 이름을 4자 이내로 입력해주세요 (공백 제외).",
    }),
  ordererName: z
    .string()
    .min(1, { message: "주문자 이름을 입력해주세요." })
    .refine((val) => testKoreanName(val), {
      message: "한글 이름을 4자 이내로 입력해주세요 (공백 제외).",
    }),
  phone: z
    .string()
    .min(11, { message: "핸드폰 번호를 입력해주세요." })
    .refine((val) => testValidPhoneNumber(val), {
      message: "올바른 핸드폰 번호를 입력해주세요.",
    }),
});

export const PaymentInitSchema = PaymentSchema.omit({
  orderDate: true,
});

export const CancelMealSchema = z.object({
  bankDetails: z
    .string()
    .trim()
    .refine((val) => testBankDetails(val), {
      message: "올바른 계좌 번호를 입력해주세요.",
    })
    .refine((val) => testBankAccountNumber(val), {
      message: "글자는 입력할 수 없습니다.",
    }),
  accountHolder: z
    .string()
    .min(2, { message: "예금주명을 입력해주세요." })
    .max(5, { message: "예금주명만 입력해주세요" }),
  bankName: z.string().min(2, { message: "은행 이름을 입력해주세요." }),
});

export const PaymentSearchSchema = z.object({
  searchTerm: z.string(),
  type: z.enum(["school", "student", "payer"]),
});

export const RefundSearchSchema = z.object({
  searchTerm: z.string(),
  type: z.enum(["school", "student", "accountHolder", "bank"]),
});

export const FindUsernameSchema = z.object({
  name: z.string().min(2, { message: "이름을 입력해주세요." }),
  phone: z
    .string()
    .min(11, { message: "핸드폰 번호를 입력해주세요." })
    .refine((val) => testValidPhoneNumber(val), {
      message: "올바른 핸드폰 번호를 입력해주세요.",
    }),
});

export const ResetPasswordSchema = StudentSignUpSchema.pick({
  username: true,
  phone: true,
});

export const ResetPasswordVerificationSchema = z.object({
  code: z
    .string()
    .min(6, "인증번호는 최소 6자 이상입니다.")
    .regex(/^\d{6}$/, "인증번호를 확인해주세요"),
});

export const ResetPasswordFinalSchema = z.object({
  password: z
    .string()
    .min(8, { message: "비밀번호는 최소 8자 이상입니다." })
    .regex(/[a-zA-Z]/, { message: "비밀번호에 영문자가 포함되어야 합니다." })
    .regex(/[0-9]/, { message: "비밀번호에 숫자가 포함되어야 합니다." })
    .trim(),
  confirmPassword: z
    .string()
    .min(8, { message: "비밀번호는 최소 8자 이상입니다." })
    .regex(/[a-zA-Z]/, { message: "비밀번호에 영문자가 포함되어야 합니다." })
    .regex(/[0-9]/, { message: "비밀번호에 숫자가 포함되어야 합니다." })
    .trim(),
});

export const StudentSearchSchema = z.object({
  searchTerm: z.string(),
  type: z.enum(["username", "studentName", "schoolName", "studentEmail"]),
});
export const SchoolUserSearchSchema = z.object({
  searchTerm: z.string(),
  type: z.enum(["username", "schoolName", "name"]),
});
