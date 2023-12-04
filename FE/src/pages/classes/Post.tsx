import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { File } from "lucide-react";
import Comment from "./Comment";
import { GanttChartSquare } from "lucide-react";

export default function Post() {
  return (
    <div className="relative flex flex-col gap-3 h-fit w-full  border-solid border-2 p-[3rem] rounded-lg">
      <div className="absolute top-10 right-10 flex gap-2">
        <Badge>PRIVATE</Badge>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-2 items-center  ">
          <Avatar className="h-[40px] w-[42px]">
            <AvatarImage alt="@shadcn" />
            <AvatarFallback>T</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[0.8rem] font-medium leading-non">Quan</span>
            <span className="text-[0.6rem] text-muted-foreground">20/4</span>
          </div>
          <Badge variant="secondary">TEACHER</Badge>
          <Badge variant="secondary">STUDENT</Badge>
        </div>
      </div>
      <div className="flex gap-2 items-center justify-between ">
        <h1 className="  scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
          Nộp bài cuối kì lamo lmao
        </h1>
      </div>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. In, doloremque
        quam a sed sunt nisi quo veritatis quae consectetur. Iure rerum non vel
        accusantium quis eaque debitis consequuntur temporibus suscipit sapiente
        officia, accusamus, sit impedit commodi esse hic magnam illum?
      </p>

      <div className="">
        <File size={50}></File>
      </div>
      <Separator orientation="horizontal"></Separator>
      <div className=" flex gap-2 cursor-pointer">
        <GanttChartSquare size={20}></GanttChartSquare>
        <span className=" text-muted-foreground text-[0.8rem]">
          Show comments
        </span>
      </div>
      <div className=" flex flex-col gap-5 mt-4">
        <Comment></Comment>
        <Comment></Comment>
        <Comment></Comment>
      </div>
    </div>
  );
}
