import api from "@/axios/axios";
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
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { MyError } from "@/ultis/appType";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGetClassId, useGetUserInfo } from "../customhook/classCustomHooks";

const CONFIRM_LEAVE_CLASS_TEXT = "Leave class";
const Schema = z
  .object({
    confirmText: z.string(),
  })
  .refine((data) => data.confirmText === CONFIRM_LEAVE_CLASS_TEXT, {
    message: "Confirmation text dont match",
    path: ["confirmText"], // path of error
  });
type SchemaType = z.infer<typeof Schema>;

export default function LeaveClassForm() {
  const { toast } = useToast();
  const form = useForm<SchemaType>({
    resolver: zodResolver(Schema),
  });
  const { userInfo } = useGetUserInfo();
  const classId = useGetClassId();
  const [errorMess, setErrorMess] = useState<string>();
  const LeaveClassMutate = async () => {
    const res = await api.post("/user/class/leaveClass", {
      userId: userInfo?.userId,
      classId,
    });
    return res;
  };
  const { mutate, isPending } = useMutation({
    mutationFn: LeaveClassMutate,
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

  const onLeaveClass = async () => {
    await mutate();
    return;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onLeaveClass)}
        className="space-y-3"
        id="classCreate"
      >
        <FormField
          control={form.control}
          name="confirmText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm text </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Leave class" />
              </FormControl>
              <FormDescription>{`Type "${CONFIRM_LEAVE_CLASS_TEXT}" to confirm your action`}</FormDescription>
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
          type="submit"
          variant="destructive"
          className="w-full  font-bold"
        >
          {isPending ? <Spinner /> : "Leave"}
        </Button>
      </form>
    </Form>
  );
}
