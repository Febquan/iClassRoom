import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Comment as CommentType } from "@/ultis/appType";
import { useGetClassId, useGetClassInfo } from "../customhook/classCustomHooks";
import dayjs from "@/ultis/myDayjs";
export default function Comment({ commentData }: { commentData: CommentType }) {
  const classId = useGetClassId();
  const { classInfo } = useGetClassInfo(classId!);
  const commentAuthor = classInfo?.haveStudent.find(
    (user) => user.userId === commentData.authorId
  );
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
            <span className="text-md font-bold leading-non ">
              {commentAuthor?.student.userName}
            </span>
          </div>
          <p className="text-[1rem] font-semibold">{commentData.content}</p>
        </div>
      </div>
    </div>
  );
}
