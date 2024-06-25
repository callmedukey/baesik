type StudentNav = {
  href: string;
  label: string;
};

export const studentNavs: StudentNav[] = [
  { href: "/student", label: "학식 조회" },
  { href: "/student/cancelation", label: "취소 신청" },
  { href: "/student/reverse-cancelation", label: "재신청" },
  { href: "/student/payments", label: "결제 내역" },
  { href: "/student/cart", label: "장바구니" },
];
