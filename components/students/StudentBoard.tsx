"use client";
import type { Posts } from "@prisma/client";
import { StudentBoardTab } from "./StudentBoardTab";
import { useState } from "react";
import { Button } from "../ui/button";
import StudentBoardWrite from "./StudentBoardWrite";

const StudentBoard = ({
  page,
  myPosts,
  myPostsCount,
  totalPage,
  posts,
  pinnedPosts,
}: {
  page: number;
  myPosts: Posts[];
  myPostsCount: number;
  totalPage: number;
  posts: Posts[];
  pinnedPosts: Posts[];
}) => {
  const [write, setWrite] = useState(false);
  return (
    <>
      <Button
        className="mr-0 ml-auto"
        variant={"outline"}
        onClick={() => setWrite(!write)}
      >
        글쓰기
      </Button>
      {write ? (
        <StudentBoardWrite />
      ) : (
        <StudentBoardTab
          page={page}
          myPosts={myPosts}
          myPostsCount={myPostsCount}
          totalPage={totalPage}
          posts={posts}
          pinnedPosts={pinnedPosts}
        />
      )}
    </>
  );
};

export default StudentBoard;
