import { getBoardPost } from "@/actions/common";
import { verifySession } from "@/actions/session";
import AdminBoardPin from "@/components/common/AdminBoardPin";
import BoardDelete from "@/components/common/BoardDelete";
import CommentSection from "@/components/common/CommentSection";
import MainContainer from "@/components/layout/main-container";
import { format } from "date-fns";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const page = async ({ params }: { params: { postId: string } }) => {
  const { postId } = params;
  const post = await getBoardPost(postId, true);
  const session = await verifySession();

  if (!post) {
    redirect("/404");
  }
  if (!session) {
    redirect("/login");
  }

  return (
    <MainContainer hasHeader className="block py-12">
      <section className="flex flex-col gap-4 max-w-4xl px-4 w-full mx-auto">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div className="grid grid-cols-2">
          <h2 className="text-slate-500">글쓴이: {post.name}</h2>
          <p className="text-sm text-slate-500 text-right">
            {format(post.createdAt, "yyyy-MM-dd HH:mm")}
          </p>
        </div>
        <div
          className="board-post"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <CommentSection
          postId={post.id}
          comments={post.comments}
          isAdmin
          sessionId={session.userId}
        />
        {post.isAdmin && <AdminBoardPin isPinned={post.isPinned} />}
        <BoardDelete isAdmin={true} />
      </section>
    </MainContainer>
  );
};

export default page;
