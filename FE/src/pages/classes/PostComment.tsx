import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { SendHorizontal } from "lucide-react";
export default function PostComment() {
  return (
    <div className=" flex items-center gap-2 h-fit justify-center p-1">
      <div className=" flex flex-col justify-center items-center ">
        <Avatar className="h-[40px] w-[42px]">
          <AvatarImage alt="@shadcn" />
          <AvatarFallback>T</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-[0.8rem] font-medium leading-non">Quan</span>
        </div>
      </div>
      <div className=" w-full  relative">
        <span
          contentEditable={true}
          role="textbox"
          className="  border-solid border-2 p-[1rem] px-[1.5rem] rounded-3xl block overflow-hidden w-full  "
          placeholder="Type your comment here."
        />
        <span className=" absolute right-4 bottom-[11px]  cursor-pointer  hover:bg-accent rounded-full p-2 ">
          <SendHorizontal></SendHorizontal>
        </span>
      </div>
    </div>
  );
}
