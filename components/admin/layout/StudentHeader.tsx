import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import StudentMobileMenu from "./StudentMobileMenu";
import { studentNavs } from "./studentNavs";

const StudentHeader = () => {
  return (
    <header className="h-16 flex items-center border-b shadow-sm px-2 sticky top-0 bg-white z-10 print:hidden">
      <h1 className="text-2xl font-bold ml-2">준푸드</h1>

      <NavigationMenu className="ml-auto mr-0 hidden md:flex">
        <NavigationMenuList className="">
          {studentNavs.map((nav) => (
            <NavigationMenuItem key={nav.href}>
              <Link href={nav.href} legacyBehavior passHref prefetch={false}>
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
      <StudentMobileMenu />
    </header>
  );
};

export default StudentHeader;
