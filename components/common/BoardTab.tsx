import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Posts } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BoardTab({
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
}) {
  const userType = isSchool
    ? "school"
    : isAdmin
    ? "admin/dashboard"
    : "student";

  return (
    <Tabs defaultValue="게시글" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="게시글">게시글</TabsTrigger>
        <TabsTrigger value="내가 작성한 글">내가 작성한 글</TabsTrigger>
      </TabsList>
      <TabsContent value="게시글">
        <Card>
          <CardContent className="space-y-2 h-[800px] py-2 overflow-y-scroll">
            {posts.length === 0 && pinnedPosts.length === 0 && (
              <div className="text-center text-muted-foreground">
                아직 게시글이 없습니다.
              </div>
            )}
            {(posts.length > 0 || pinnedPosts.length > 0) && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px] max-w-[100px]">
                      작성자
                    </TableHead>
                    <TableHead className="w-full">제목</TableHead>
                    <TableHead className="min-w-[150px] max-w-[150px]">
                      작성일
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pinnedPosts.map((post) => (
                    <TableRow
                      key={post.id}
                      className="bg-gray-100 font-semibold"
                    >
                      <TableCell className="w-[200px]">
                        <Link href={`/${userType}/board/${post.id}`}>
                          {post.name}
                        </Link>
                      </TableCell>
                      <TableCell className="truncate max-w-lg">
                        <Link href={`/${userType}/board/${post.id}`}>
                          {post.title}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        <Link href={`/${userType}/board/${post.id}`}>
                          {format(post.createdAt, "yyyy-MM-dd HH:mm")}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="w-[200px]">
                        <Link href={`/${userType}/board/${post.id}`}>
                          {post.name}
                        </Link>
                      </TableCell>
                      <TableCell className="truncate max-w-lg">
                        <Link href={`/${userType}/board/${post.id}`}>
                          {post.title}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        <Link href={`/${userType}/board/${post.id}`}>
                          {format(post.createdAt, "yyyy-MM-dd HH:mm")}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter>
            <Pagination>
              <PaginationContent>
                {page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={`/${userType}/board?page=${page - 1}`}
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
                    <PaginationNext
                      href={`/${userType}/board?page=${page + 1}`}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="내가 작성한 글">
        <Card>
          <CardContent className="space-y-2 h-[800px] py-2 overflow-y-scroll">
            {myPosts.length === 0 && (
              <div className="text-center text-muted-foreground">
                아직 게시글이 없습니다.
              </div>
            )}
            {myPosts.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px] max-w-[100px]">
                      작성자
                    </TableHead>
                    <TableHead className="w-full">제목</TableHead>
                    <TableHead className="min-w-[150px] max-w-[150px]">
                      작성일
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myPosts.map((post) => (
                    <TableRow
                      key={post.id}
                      className={cn(
                        post.isPinned && "bg-gray-100 font-semibold"
                      )}
                    >
                      <TableCell className="w-[200px]">
                        <Link href={`/${userType}/board/${post.id}`}>
                          {post.name}
                        </Link>
                      </TableCell>
                      <TableCell className="truncate max-w-lg">
                        <Link href={`/${userType}/board/${post.id}`}>
                          {post.title}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        <Link href={`/${userType}/board/${post.id}`}>
                          {format(post.createdAt, "yyyy-MM-dd HH:mm")}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
