"use client";
import type { Admin, Comments, SchoolUser, Student } from "@prisma/client";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { deleteComment, postComment } from "@/actions/common";
import { format } from "date-fns";

interface CommentWithUser extends Comments {
  admin?: Admin | null;
  schoolUser?: SchoolUser | null;
  student?: Student | null;
}

const CommentSection = ({
  postId,
  comments,
  isAdmin = false,
  isSchool = false,
  sessionId,
}: {
  postId: string;
  comments: CommentWithUser[];
  isAdmin?: boolean;
  isSchool?: boolean;
  sessionId: string;
}) => {
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!comment) {
      return;
    }
    setIsLoading(true);
    const { message, success } = await postComment({
      postId,
      comment,
      isAdmin,
      isSchool,
    });
    setIsLoading(false);

    if (success) {
      alert(message);
      setComment("");
    } else {
      alert(message);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("삭제하시겠습니까?")) {
      return;
    }
    setIsLoading(true);
    const { message } = await deleteComment(commentId);
    alert(message);
    setIsLoading(false);
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        {comments.map((comment) => (
          <div key={comment.id} className="flex flex-col">
            {comment?.admin && (
              <div className="text-sm text-gray-500 font-medium flex justify-between">
                <span>
                  관리자 {format(comment.createdAt, "yyyy-MM-dd HH:MM")}
                </span>
                {isAdmin && (
                  <button
                    className="text-red-500"
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                  >
                    삭제
                  </button>
                )}
              </div>
            )}
            {comment?.student && (
              <div className="text-sm text-gray-500 font-medium flex justify-between">
                <span>{comment.student.username}</span>
                {comment.student.id === sessionId && (
                  <button
                    className="text-red-500"
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                  >
                    삭제
                  </button>
                )}
              </div>
            )}
            {comment?.schoolUser && (
              <div className="text-sm text-gray-500 font-medium flex justify-between">
                <span>{comment.schoolUser?.username}</span>
                {comment.schoolUser.id === sessionId && (
                  <button
                    className="text-red-500"
                    type="button"
                    onClick={() => handleDelete(comment.id)}
                  >
                    삭제
                  </button>
                )}
              </div>
            )}
            <div className="border p-1 rounded-md shadow-sm">
              {comment.content}
            </div>
          </div>
        ))}
      </div>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full resize-none overflow-y-auto mt-6 border-black"
        placeholder="댓글을 입력해주세요."
        rows={5}
      />
      <Button type="button" className="w-full mt-6" onClick={handleSubmit}>
        댓글 달기
      </Button>
    </div>
  );
};

export default CommentSection;
