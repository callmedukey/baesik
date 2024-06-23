import { cn } from "@/lib/utils";
import React from "react";

const MainContainer = ({
  children,
  className,
  hasHeader,
}: {
  children?: React.ReactNode;
  className?: string;
  hasHeader?: boolean;
}) => {
  return (
    <main
      className={cn(
        "flex flex-col items-center justify-center min-h-[100dvh] w-full p-4",
        hasHeader && "min-h-[calc(100dvh_-_4rem)]",
        className
      )}
    >
      {children}
    </main>
  );
};

export default MainContainer;
