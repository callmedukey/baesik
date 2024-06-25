import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

const AdminHeader = () => {
  return (
    <header className="h-16 flex items-center border-b shadow-sm px-2">
      <NavigationMenu className="ml-auto mr-0">
        <NavigationMenuList className="">
          <NavigationMenuItem>
            <Link href="/admin/dashboard" legacyBehavior passHref>
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle())}>
                홈
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/admin/dashboard/schools" legacyBehavior passHref>
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle())}>
                명단 관리
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/admin/dashboard/menus" legacyBehavior passHref>
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle())}>
                메뉴 관리
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/admin/dashboard/payments" legacyBehavior passHref>
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle())}>
                입금 관리
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/admin/dashboard/refunds" legacyBehavior passHref>
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle())}>
                환불 관리
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

export default AdminHeader;
