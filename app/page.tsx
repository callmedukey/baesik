import MainContainer from "@/components/layout/main-container";
import { Button } from "@/components/ui/button";
import Logo from "@/public/main-logo.svg";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <MainContainer>
      <div className="max-w-sm w-full flex items-center justify-center flex-col">
        <Image src={Logo} alt="Logo" height={250} width={250} />
        <h1 className="text-2xl font-bold mb-6">준푸드</h1>
        <div className="flex flex-col w-full mx-auto gap-2 max-w-[300px]">
          <Button className="w-full" asChild>
            <Link href="/login">로그인</Link>
          </Button>
          <Button variant={"outline"} className="w-full" asChild>
            <Link href="/signup">회원가입</Link>
          </Button>
        </div>
      </div>
    </MainContainer>
  );
}
