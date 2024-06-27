import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import StudentMobileMenu from "./StudentMobileMenu";

const StudentHeader = () => {
  return (
    <header className="h-16 flex items-center border-b shadow-sm px-2 sticky top-0 bg-white z-10">
      <h1 className="text-2xl font-bold ml-2">준푸드</h1>

      <NavigationMenu className="ml-auto mr-0 hidden md:flex">
        <NavigationMenuList className="">
          <NavigationMenuItem>
            <Link href="/student" legacyBehavior passHref>
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle())}>
                식사 신청 및 조회
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/student/cancelation" legacyBehavior passHref>
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle())}>
                취소 신청
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/student/reverse-cancelation" legacyBehavior passHref>
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle())}>
                재신청
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/student/payments" legacyBehavior passHref>
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle())}>
                결제 내역
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/student/cart" legacyBehavior passHref>
              <NavigationMenuLink className={cn(navigationMenuTriggerStyle())}>
                <ShoppingCartIcon className="size-5" />
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <StudentMobileMenu />
    </header>
  );
};

export default StudentHeader;
