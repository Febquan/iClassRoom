import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Comment as CommentType } from "@/ultis/appType";
import {
  useDeleteComment,
  useGetClassId,
  useGetClassInfo,
  useGetUserInfo,
} from "../customhook/classCustomHooks";
import dayjs from "@/ultis/myDayjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DeleteIcon, MoreVerticalIcon } from "lucide-react";
import Spinner from "@/components/ui/spinner";
export default function Comment({
  commentData,
  isTestComment,
}: {
  commentData: CommentType;
  isTestComment?: boolean;
}) {
  const classId = useGetClassId();
  const { classInfo } = useGetClassInfo(classId!);
  const { userInfo } = useGetUserInfo();
  const commentAuthor = classInfo?.haveStudent.find(
    (user) => user.userId === commentData.authorId
  );
  const isMycomment = commentAuthor?.userId == userInfo?.userId;

  const { mutate: deleteComment, isPending } = useDeleteComment();
  return (
    <div>
      <div className="flex gap-2 items-start">
        <div className=" flex flex-col justify-center items-center gap-3">
          <Avatar className="h-[40px] w-[42px] mt-1">
            <AvatarImage alt="@shadcn" src={commentAuthor?.student.avatar} />
            <AvatarFallback>
              {commentAuthor?.student.userName[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-[0.6rem] text-muted-foreground text-center">
            {dayjs(commentData.createdAt).format("HH:mm DD/MM/YY")}
          </span>
        </div>
        <div className="relative flex flex-col gap-1 h-fit w-full bg-accent border-solid border-2 px-[1rem] py-2 rounded-3xl">
          <div className="flex  items-center">
            <span className="text-md font-bold leading-non  justify-between w-full">
              {commentAuthor?.student.userName}
            </span>
            <div>
              {isPending ? (
                <Spinner></Spinner>
              ) : (
                isMycomment &&
                !isTestComment && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-8 w-8 p-0">
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <div
                          onClick={() =>
                            deleteComment({ commentId: commentData.id })
                          }
                          className=" flex gap-2 justify-center items-center"
                        >
                          <DeleteIcon className="text-destructive" /> Delete
                          post
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              )}
            </div>
          </div>
          <p className="text-[1rem] font-semibold">{commentData.content}</p>
        </div>
      </div>
    </div>
  );
}
