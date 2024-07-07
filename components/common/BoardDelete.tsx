"use client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { deletePost } from "@/actions/common";

const BoardDelete = ({
  isSchool = false,
  isAdmin = false,
}: {
  isSchool?: boolean;
  isAdmin?: boolean;
}) => {
  const router = useRouter();
  const params = useParams();

  const handleDelete = async () => {
    if (!params.postId) {
      alert("게시글이 존재하지 않습니다");
      return;
    }

    if (!confirm("게시글을 삭제하시겠습니까?")) {
      return;
    }

    const { error, message } = await deletePost(params.postId as string);
    if (error) {
      alert(error);
    }
    if (message) {
      alert(message);
      if (!isSchool && !isAdmin) {
        router.replace("/student/board");
      } else if (isSchool) {
        router.replace("/school/board");
      } else {
        router.replace("/admin/dashboard/board");
      }
    }
  };
  return (
    <Button variant="destructive" onClick={handleDelete}>
      게시글 삭제
    </Button>
  );
};

export default BoardDelete;
