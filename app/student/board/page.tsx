import MainContainer from "@/components/layout/main-container";
import { StudentBoardTab } from "@/components/students/StudentBoardTab";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getAllPostsAndCount } from "@/actions/students";
import StudentBoard from "@/components/students/StudentBoard";
export const dynamic = "force-dynamic";

const page = async ({ searchParams }: { searchParams: { page: string } }) => {
  const page = Number(searchParams.page) || 1;

  if (!page) {
    return redirect("/student/board?page=1");
  }

  const { posts, count, myPosts, myPostsCount, pinnedPosts } =
    await getAllPostsAndCount({
      page,
    });

  const totalPage = Math.ceil(count / 20);

  return (
    <MainContainer className="block py-12" hasHeader>
      <h1 className="text-2xl font-bold text-center">게시판</h1>
      <section className="max-w-4xl mx-auto w-full flex items-center justify-center py-6 px-4 flex-col gap-2">
        <StudentBoard
          page={page}
          myPosts={myPosts}
          myPostsCount={myPostsCount}
          totalPage={totalPage}
          posts={posts}
          pinnedPosts={pinnedPosts}
        />
      </section>
    </MainContainer>
  );
};

export default page;
