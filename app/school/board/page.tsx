import MainContainer from "@/components/layout/main-container";

import { redirect } from "next/navigation";

import { getAllPostsAndCount } from "@/actions/students";
import Board from "@/components/common/Board";
export const dynamic = "force-dynamic";

const page = async ({ searchParams }: { searchParams: { page: string } }) => {
  const page = Number(searchParams.page) || 1;

  if (!page) {
    return redirect("/school/board?page=1");
  }

  const { posts, count, myPosts, myPostsCount, pinnedPosts } =
    await getAllPostsAndCount({
      page,
      isSchool: true,
    });

  const totalPage = Math.ceil(count / 20);

  return (
    <MainContainer className="block py-12" hasHeader>
      <h1 className="text-2xl font-bold text-center">게시판</h1>
      <section className="max-w-4xl mx-auto w-full flex items-center justify-center py-6 px-4 flex-col gap-2">
        <Board
          page={page}
          myPosts={myPosts}
          myPostsCount={myPostsCount}
          totalPage={totalPage}
          posts={posts}
          pinnedPosts={pinnedPosts}
          isSchool
        />
      </section>
    </MainContainer>
  );
};

export default page;
