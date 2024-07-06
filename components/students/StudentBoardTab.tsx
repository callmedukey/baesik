import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Posts } from "@prisma/client";
import { format } from "date-fns";

export function StudentBoardTab({
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
}) {
  return (
    <Tabs defaultValue="게시글" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="게시글">게시글</TabsTrigger>
        <TabsTrigger value="내가 작성한 글">내가 작성한 글</TabsTrigger>
      </TabsList>
      <TabsContent value="게시글">
        <Card>
          <CardContent className="space-y-2 h-[800px] py-2 divide-y overflow-y-scroll">
            {pinnedPosts.map((post) => (
              <div className="grid grid-cols-[20%_80%] h-8" key={post.id}>
                <div className="text-center text-muted-foreground flex items-center justify-center flex-col">
                  <div>{format(post.createdAt, "yyyy-MM-dd HH:mm")}</div>
                  <div>{post.name}</div>
                </div>
                <div className="flex items-center">
                  <p className="truncate">{post.title}</p>
                </div>
              </div>
            ))}
            {posts.map((post) => (
              <div className="grid grid-cols-[20%_80%] h-8" key={post.id}>
                <div className="text-center text-muted-foreground flex items-center justify-center flex-col">
                  <div>{format(post.createdAt, "yyyy-MM-dd HH:mm")}</div>
                  <div>{post.name}</div>
                </div>
                <div className="flex items-center">
                  <p className="truncate">{post.title}</p>
                </div>
              </div>
            ))}
            {posts.length === 0 && pinnedPosts.length === 0 && (
              <div className="text-center text-muted-foreground">
                아직 게시글이 없습니다.
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Pagination>
              <PaginationContent>
                {page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={`/student/board?page=${page - 1}`}
                    />
                  </PaginationItem>
                )}
                {page > 1 && page < totalPage && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                {page < totalPage && (
                  <PaginationItem>
                    <PaginationNext href={`/student/board?page=${page + 1}`} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="내가 작성한 글">
        <Card>
          <CardContent className="space-y-2 h-[810px] py-2 divide-y overflow-y-scroll">
            {myPostsCount === 0 ? (
              <div className="text-center text-muted-foreground">
                아직 작성한 글이 없습니다.
              </div>
            ) : (
              myPosts?.map((post) => <div key={post.id}>{post.title}</div>)
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
