import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import TextEditor from "./TextEditor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserInfo } from "@/ultis/appType";
import { ClassInfo } from "./SpecificClass";
import { Badge } from "@/components/ui/badge";

const Schema = z.object({
  title: z
    .string()
    .min(1, { message: "Post title cannot be empty" })
    .max(50, { message: "Your post title is too long" }),
  description: z
    .string()
    .min(9, { message: "description cannot be empty" })
    .max(4000, { message: "Your description is too long" }),
});

type SchemaType = z.infer<typeof Schema>;

export default function CreatePost({
  userInfo,
  classInfo,
}: {
  userInfo?: UserInfo;
  classInfo?: ClassInfo;
}) {
  const role = classInfo?.haveStudent.find(
    (el) => el.userId == userInfo?.userId
  )?.role;

  const form = useForm<SchemaType>({
    resolver: zodResolver(Schema),
  });
  const [toggleOpenComment, setToggleOpenComment] = useState<boolean>(false);
  console.log(toggleOpenComment);
  const onCreatePost = async (data: SchemaType) => {
    console.log(data);
  };
  return (
    <div className="  relative flex flex-col gap-3 h-fit w-full  p-[2rem] border-solid border-2  rounded-lg">
      <div className=" flex justify-between gap-4">
        <div className=" flex gap-2 justify-center items-center">
          <Avatar className="h-[40px] w-[42px]">
            <AvatarImage src={userInfo?.avatar} alt="@shadcn" />
            <AvatarFallback>{userInfo?.userName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[1rem] font-medium leading-non">
              {userInfo?.userName}
            </span>
            <Badge className="w-fit text-[0.6rem]" variant="secondary">
              {role?.toLocaleUpperCase()}
            </Badge>
          </div>
        </div>
        <div
          onClick={() => {
            setToggleOpenComment((prev) => !prev);
            form.reset();
          }}
          className={`cursor-text transition-all hover:bg-card  w-full h-full rounded-2xl border-solid border-2 flex-1 p-[0.6rem] ${
            toggleOpenComment ? "hidden" : ""
          } `}
        >
          <span className=" text-muted-foreground">What is comming ? </span>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onCreatePost)}
          className=" transition-all grid  px-[1px]"
          style={{
            gridTemplateRows: toggleOpenComment ? "1fr" : "0fr",
          }}
          id="postCreate"
        >
          <div
            style={{ gridRow: "1 / span 2", overflowY: "hidden" }}
            className=" flex flex-col gap-4 px-1"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="scroll-m-20 text-1xl font-extrabold tracking-tight lg:text-2xl">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="The Title of the post"
                      className=" text-1xl font-bold tracking-tight lg:text-1xl h-fit p-2"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextEditor
                      content={field.value}
                      onChange={field.onChange}
                    ></TextEditor>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-fit self-end flex gap-2">
              <Button
                variant="outline"
                type="reset"
                onClick={() => setToggleOpenComment(false)}
              >
                CANCEL
              </Button>
              <Button type="submit" form="postCreate">
                CREATE POST
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
