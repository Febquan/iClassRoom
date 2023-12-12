import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { File } from "lucide-react";
import Comment from "./Comment";
import { GanttChartSquare, MoreVerticalIcon } from "lucide-react";
import PostComment from "./PostComment";
import { useState } from "react";

import parse from "html-react-parser";
import api from "@/axios/axios";
import { ClassToStudent } from "@/ultis/appType";
import { Post as PostType } from "@/ultis/appType";

import dayjs from "@/ultis/myDayjs";

export default function Post({
  postData,
  classUserInfo,
}: {
  postData: PostType;
  classUserInfo: ClassToStudent[];
}) {
  const [showComment, setShowComment] = useState<boolean>(false);
  //  const {createdAt, title, content,authorId} =postData;
  console.log(postData);
  const postAuthor = classUserInfo.find(
    (user) => user.userId === postData.authorId
  );
  function getPosition(string: string, subString: string, index: number) {
    return string.split(subString, index).join(subString).length;
  }
  const getFileName = (key: string) => {
    const pos = getPosition(key, "-", 2);
    return key.substring(pos + 1);
  };

  async function downloadFile(fileKey: string) {
    try {
      const response = await api.post("user/class/presignedS3Url", {
        fileKey,
      });
      const dowloadUrl = response.data.S3PresignedUrl;
      const a = document.createElement("a");
      a.href = dowloadUrl;
      a.download = getFileName(fileKey);
      a.click();
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="relative flex flex-col gap-3 h-fit w-full  border-solid border-2 p-[3rem] rounded-lg">
      {postData.isPrivate && (
        <div className="absolute top-10 right-10 flex gap-2">
          <Badge>PRIVATE</Badge>
        </div>
      )}
      <div className="flex items-center gap-4">
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
      </div>
      <div className="flex gap-2 items-center justify-between ">
        <h1 className="  scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
          {postData.title}
        </h1>
      </div>
      <p>{parse(postData.content)}</p>

      <div className=" flex flex-col gap-2">
        {postData.fileKeys.map((key) => (
          <div>
            <Badge
              variant="secondary"
              className="text-[1rem] px-2 w-fit flex gap-2 cursor-pointer"
              onClick={() => {
                downloadFile(key);
              }}
            >
              <File size={20}></File>
              <span> {getFileName(key)} </span>
            </Badge>
          </div>
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
          <PostComment></PostComment>
          <div className=" flex flex-col gap-5 mt-4  ">
            <Comment></Comment>
            <Comment></Comment>
            <Comment></Comment>
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
