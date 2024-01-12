import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Spinner from "@/components/ui/spinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SendHorizontal } from "lucide-react";
import { useGetClassId, useGetUserInfo } from "../customhook/classCustomHooks";
import { MyError } from "@/ultis/appType";
import { useToast } from "@/components/ui/use-toast";
import api from "@/axios/axios";
import { useRef } from "react";
export default function PostComment({ postId }: { postId: string }) {
  const queryClient = useQueryClient();
  const classId = useGetClassId();
  const { toast } = useToast();
  const { userInfo } = useGetUserInfo();
  const onPostComment = async () => {
    if (!commentRef.current || commentRef.current.textContent == "") return;
    await api.post("/user/class/postComment", {
      classId,
      postId,
      authorId: userInfo?.userId,
      content: commentRef.current.textContent,
    });
    commentRef.current.textContent = "";
  };
  const { mutate, isPending } = useMutation({
    mutationFn: onPostComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`Class-${classId}`] });
    },
    onError: (error) => {
      const err = error as MyError;
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${err.message}`,
      });
    },
  });
  const commentRef = useRef<HTMLSpanElement>(null);
  return (
    <div className=" flex items-center gap-2 h-fit justify-center p-1">
      <div className=" flex flex-col justify-center items-center w-fit ">
        <Avatar className="h-[40px] w-[42px] ">
          <AvatarImage alt="@shadcn" src={userInfo?.avatar} />
          <AvatarFallback> {userInfo?.userName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col ">
          <span className="text-[0.8rem] font-medium leading-non  text-center">
            {userInfo?.userName}
          </span>
        </div>
      </div>
      <div className=" w-full  relative">
        <span
          contentEditable={true}
          role="textbox"
          className="  border-solid border-2 p-[1rem] px-[1.5rem] rounded-3xl block overflow-hidden w-full  "
          placeholder="Type your comment here."
          ref={commentRef}
        />

        <span
          onClick={() => {
            mutate();
          }}
          className=" absolute right-4 bottom-[11px]  cursor-pointer  hover:bg-accent rounded-full p-2 "
        >
          {isPending ? <Spinner></Spinner> : <SendHorizontal></SendHorizontal>}
        </span>
      </div>
    </div>
  );
}
