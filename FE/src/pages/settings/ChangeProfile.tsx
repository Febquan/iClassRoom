import api from "@/axios/axios";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import Spinner from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { MyError } from "@/ultis/appType";
import { useGetUserInfo } from "../customhook/classCustomHooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Dropzone from "@/ultis/DropZone";

const Schema = z.object({
  displayName: z.string().min(1, { message: "Name can not be empty" }),
  files: z.array(z.instanceof(File)).optional(),
});

type SchemaType = z.infer<typeof Schema>;

export default function ChangeProfileForm() {
  const { toast } = useToast();
  const [errorMess, setErrorMess] = useState<string>();
  const { userInfo } = useGetUserInfo();
  const form = useForm<SchemaType>({
    resolver: zodResolver(Schema),
  });
  const onChangePass = async (data: SchemaType) => {
    const formData = new FormData();
    if (data.files?.length) {
      for (let i = 0; i < data.files.length; i++) {
        formData.append("files", data.files[i]);
      }
    }
    formData.append("userName", data.displayName);
    await api.post("/user/auth/changeinfo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: onChangePass,
    onSuccess: () => {
      toast({
        title: "Profile changed.",
      });
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
    },
    onError: (error) => {
      const err = error as MyError;
      setErrorMess(err.response?.data.error);
    },
  });

  const onChangeProfile = async (formData: SchemaType) => {
    console.log(formData);
    await mutate(formData);
  };
  const previewFile = form.watch("files");
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onChangeProfile)}
        className="space-y-3"
        id="changeProfile"
      >
        <div className=" grid  gap-5 justify-center items-center grid-cols-[1fr_2fr]">
          <div className="w-full flex justify-center items-center">
            <div className=" overflow-hidden  border-solid border-2 rounded-md flex justify-center items-center p-2 h-[200px] w-[200px]">
              {previewFile && previewFile[0] ? (
                <img
                  src={URL.createObjectURL(previewFile[0])}
                  alt="profile picture"
                  height={200}
                  width={200}
                />
              ) : (
                <img
                  src={userInfo?.avatar}
                  alt="profile picture"
                  height={200}
                  width={200}
                />
              )}
            </div>
          </div>

          <div className=" self-start flex flex-col gap-2 ">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name:</FormLabel>
                  <FormControl>
                    <Input {...field} defaultValue={userInfo?.userName} />
                  </FormControl>
                  <FormDescription>Your display name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="files"
              render={() => (
                <div className="flex flex-col gap-2">
                  <FormLabel>Avatar:</FormLabel>
                  <div className="h-4 vis">
                    <Dropzone
                      multiple={false}
                      form={form}
                      accept={{
                        "image/*": [".png", ".gif", ".jpeg", ".jpg"],
                      }}
                    ></Dropzone>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
        {errorMess && (
          <span className="text-red-500 text-center w-full block ">
            {errorMess}
          </span>
        )}
        <Button
          disabled={isPending}
          type="submit"
          className="w-full  font-bold"
          variant="ghost"
        >
          {isPending ? <Spinner></Spinner> : "Change profile"}
        </Button>
      </form>
    </Form>
  );
}
