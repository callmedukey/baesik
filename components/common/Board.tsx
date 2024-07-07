"use client";
import type { Posts } from "@prisma/client";
import { BoardTab } from "./BoardTab";
import { useState } from "react";
import { Button } from "../ui/button";
import BoardWrite from "./BoardWrite";

const Board = ({
  page,
  myPosts,
  myPostsCount,
  totalPage,
  posts,
  pinnedPosts,
  isSchool = false,
  isAdmin = false,
}: {
  page: number;
  myPosts: Posts[];
  myPostsCount: number;
  totalPage: number;
  posts: Posts[];
  pinnedPosts: Posts[];
  isSchool?: boolean;
  isAdmin?: boolean;
}) => {
  const [write, setWrite] = useState(false);
  return (
    <>
      <Button
        className="mr-0 ml-auto"
        variant={"outline"}
        onClick={() => setWrite(!write)}
      >
        {write ? "뒤로가기" : "글쓰기"}
      </Button>
      {write ? (
        <BoardWrite isSchool={isSchool} isAdmin={isAdmin} />
      ) : (
        <BoardTab
          page={page}
          myPosts={myPosts}
          myPostsCount={myPostsCount}
          totalPage={totalPage}
          posts={posts}
          pinnedPosts={pinnedPosts}
          isSchool={isSchool}
          isAdmin={isAdmin}
        />
      )}
    </>
  );
};

export default Board;
