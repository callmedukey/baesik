"use client";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { adminNavs } from "./adminNavs";

const AdminMobileMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        className="ml-auto mr-0 md:hidden"
        aria-label="모바일 메뉴"
      >
        <Menu className="size-12 stroke-black mr-0 ml-auto md:hidden" />
      </DrawerTrigger>
      <DrawerContent className="px-2 text-xl py-4 ">
        <nav className="flex flex-col gap-4 px-4">
          {adminNavs.map((nav) => (
            <Link href={nav.href} key={nav.href} onClick={() => setOpen(false)}>
              {nav.label}
            </Link>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  );
};

export default AdminMobileMenu;
