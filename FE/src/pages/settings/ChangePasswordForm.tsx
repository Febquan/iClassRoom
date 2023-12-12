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
import { useMutation } from "@tanstack/react-query";

const Schema = z
  .object({
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
    oldPassword: z.string().min(1, { message: "Emty field" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });
type SchemaType = z.infer<typeof Schema>;
type sendData = Omit<SchemaType, "confirmPassword">;
export default function ChangePasswordForm() {
  const { toast } = useToast();
  const [errorMess, setErrorMess] = useState<string>();
  const form = useForm<SchemaType>({
    resolver: zodResolver(Schema),
  });
  const onChangePass = async (data: sendData) => {
    const res = await api.post("/user/auth/changepass", data);
    return res;
  };
  const { mutate, isPending } = useMutation({
    mutationFn: onChangePass,
    onSuccess: () => {
      toast({
        title: "Password changed.",
      });
    },
    onError: (error) => {
      const err = error as MyError;
      setErrorMess(err.response?.data.error);
    },
  });
  const { userInfo } = useGetUserInfo();
  const isOauth = userInfo?.isOauth;
  const onChangePassword = async (formData: SchemaType) => {
    console.log(formData);
    await mutate({
      newPassword: formData.newPassword,
      oldPassword: formData.oldPassword,
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onChangePassword)}
        className="space-y-3"
        id="classCreate"
      >
        <FormField
          disabled={isOauth}
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" defaultValue={""} />
              </FormControl>
              <FormDescription>Your New Password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={isOauth}
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input {...field} type="password" defaultValue={""} />
              </FormControl>
              <FormDescription>Confirm your new password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isOauth}
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old password</FormLabel>
              <FormControl>
                <Input {...field} type="password" defaultValue={""} />
              </FormControl>
              <FormDescription>Enter your old password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {errorMess && (
          <span className="text-red-500 text-center w-full block ">
            {errorMess}
          </span>
        )}
        <Button
          disabled={isOauth}
          type="submit"
          className="w-full  font-bold"
          variant="ghost"
        >
          {isOauth ? (
            "Your account is provided by other service"
          ) : isPending ? (
            <Spinner />
          ) : (
            "Change"
          )}
        </Button>
      </form>
    </Form>
  );
}
