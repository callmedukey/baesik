type AdminNav = {
  href: string;
  label: string;
};

export const adminNavs: AdminNav[] = [
  { href: "/admin/dashboard", label: "홈" },
  { href: "/admin/dashboard/schools", label: "명단 관리" },
  { href: "/admin/dashboard/menus", label: "메뉴 관리" },
  { href: "/admin/dashboard/payments", label: "입금 관리" },
  { href: "/admin/dashboard/refunds", label: "환불 관리" },
  { href: "/admin/dashboard/students", label: "학생 관리" },
  { href: "/admin/dashboard/school-admins", label: "관리자 관리" },
];
