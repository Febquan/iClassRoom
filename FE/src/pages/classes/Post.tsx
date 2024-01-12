import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Comment from "./Comment";
import { DeleteIcon, GanttChartSquare, MoreVerticalIcon } from "lucide-react";
import PostComment from "./PostComment";
import { useState } from "react";

import parse from "html-react-parser";
import { ClassToStudent } from "@/ultis/appType";
import { Post as PostType } from "@/ultis/appType";

import dayjs from "@/ultis/myDayjs";
import { sortByTime } from "@/ultis/classFunctions";
import { FileComponent } from "./FileComponent";
import { useDeletePost, useGetUserInfo } from "../customhook/classCustomHooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";

export default function Post({
  postData,
  classUserInfo,
}: {
  postData: PostType;
  classUserInfo: ClassToStudent[];
}) {
  const [showComment, setShowComment] = useState<boolean>(false);
  const { userInfo } = useGetUserInfo();
  const postAuthor = classUserInfo.find(
    (user) => user.userId === postData.authorId
  );

  const sortedComment = postData.comments.sort(sortByTime);
  const { mutate: deletePost, isPending: isPendingDeletePost } =
    useDeletePost();
  return (
    <div className="relative flex flex-col gap-3 h-fit w-full  border-solid border-2 p-[3rem] rounded-lg">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex gap-2 items-center  ">
          <Avatar className="h-[40px] w-[42px]">
            <AvatarImage src={postAuthor?.student.avatar} alt="@shadcn" />
            <AvatarFallback>{postAuthor?.student.userName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[0.8rem] font-medium leading-non">
              {postAuthor?.student.userName}
            </span>
            <span className="text-[0.6rem] text-muted-foreground">
              {dayjs(postData.createdAt).format("HH:mm DD/MM/YY")}
            </span>
          </div>
          {postAuthor?.role == "teacher" && (
            <Badge variant="secondary">TEACHER</Badge>
          )}
          {postAuthor?.role == "student" && (
            <Badge variant="secondary">STUDENT</Badge>
          )}
        </div>
        {postAuthor?.userId == userInfo?.userId &&
          (isPendingDeletePost ? (
            <Spinner />
          ) : (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-8 w-8 p-0">
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <div
                      onClick={() => deletePost({ postId: postData.id })}
                      className=" flex gap-2 justify-center items-center"
                    >
                      <DeleteIcon className="text-destructive" /> Delete post
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
      </div>
      <div className="flex gap-2 items-center justify-between ">
        <h1 className="  scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
          {postData.title}
        </h1>
      </div>
      <div className="my-content-tiptap">{parse(postData.content)}</div>

      <div className=" flex flex-col gap-2">
        {postData.fileKeys.map((key, i) => (
          <FileComponent fileKey={key} key={i} />
        ))}
      </div>
      <Separator orientation="horizontal"></Separator>

      <div className=" flex gap-2 cursor-pointer">
        <GanttChartSquare size={20}></GanttChartSquare>
        <span
          className=" text-muted-foreground text-[0.8rem]"
          onClick={() => {
            setShowComment((prev) => !prev);
          }}
        >
          Show comments
        </span>
      </div>
      <div
        className="grid  overflow-hidden transition-all"
        style={{
          gridTemplateRows: showComment ? "1fr" : "0fr",
        }}
      >
        <div className=" overflow-y-hidden flex flex-col">
          <PostComment postId={postData.id}></PostComment>
          <div className=" flex flex-col gap-5 mt-4  ">
            {sortedComment.map((el, i) => (
              <Comment key={i} commentData={el} />
            ))}
          </div>
          <div className=" flex gap-2 cursor-pointer self-end mt-3">
            <span
              className=" text-muted-foreground text-[0.8rem]"
              onClick={() => {
                setShowComment((prev) => !prev);
              }}
            >
              Load more comments
            </span>
            <MoreVerticalIcon size={20}></MoreVerticalIcon>
          </div>
        </div>
      </div>
    </div>
  );
}
