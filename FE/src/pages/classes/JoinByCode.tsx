import api from "@/axios/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { MyError } from "@/ultis/appType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useGetUserInfo } from "../customhook/classCustomHooks";

export default function JoinByCode() {
  const [code, setCode] = useState<string | null>();
  const userId = useGetUserInfo().userInfo?.userId;
  const onChangePass = async () => {
    const res = await api.post(`/user/class/joinByCode/`, { code, userId });
    return res;
  };
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: onChangePass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userClasses"] });
      toast({
        title: "You Joined New Class !",
      });
    },
    onError: (error) => {
      const err = error as MyError;
      toast({
        title: err.response?.data.error,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex gap-2 justify-center items-center">
      <Input
        placeholder="Class code "
        onChange={(e) => setCode(e.target.value)}
      ></Input>
      <Button onClick={() => mutate()} disabled={isPending}>
        Join
      </Button>
    </div>
  );
}
