import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { adminNavs } from "./adminNavs";
import AdminMobileMenu from "./AdminMobileMenu";

const AdminHeader = () => {
  return (
    <header className="h-16 flex items-center border-b shadow-sm px-2 print:hidden">
      <h1 className="text-2xl font-bold ml-2">준푸드</h1>
      <NavigationMenu className="ml-auto mr-0 hidden md:flex">
        <NavigationMenuList className="">
          {adminNavs.map((nav) => (
            <NavigationMenuItem key={nav.href}>
              <Link href={nav.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle())}
                >
                  {nav.label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <AdminMobileMenu />
    </header>
  );
};

export default AdminHeader;
