import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const noto = Noto_Sans_KR({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "준푸드",
  description: "준푸드시스템 | 준푸드 시스템입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          noto.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
