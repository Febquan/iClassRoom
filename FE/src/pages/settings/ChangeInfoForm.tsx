import api from "../../axios/axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button, Spinner } from "@nextui-org/react";
import MyArlertNotice from "../../components/MyArlertNotice";
import MySuscesstNotice from "../../components/MySuscessNotice";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Schema = z.object({
  userName: z.string().min(1, { message: "Emty field" }),
});

export default function ChangeInfoForm() {
  const queryClient = useQueryClient();
  const userInfo = queryClient.getQueryData(["userInfo"]);

  const onChangeInfo = async (data) => {
    return await api.post("/user/changeinfo", data);
  };
  const [errorMess, setErrorMess] = useState(null);
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: onChangeInfo,
    onSuccess: (data) => {
      // Invalidate and refetch the posts query after successful mutation
      queryClient.setQueryData(["userInfo"], data.data.userInfo);
    },
  });
  const onChangeSubmit = async (formData) => {
    try {
      setErrorMess(null);
      await mutate({
        newUserName: formData.userName,
      });
    } catch (err) {
      setErrorMess(err.response.data.error);
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(Schema), // Hook up zodResolver
  });
  return (
    <form
      className="flex w-full flex-col gap-[1rem]"
      onSubmit={handleSubmit(onChangeSubmit)}
    >
      <span className="text-[2rem]">Change Password</span>

      <Input
        type="text"
        label="Email"
        disabled
        variant="bordered"
        value={userInfo.email}
      ></Input>
      <Input
        type="text"
        label="User Name"
        defaultValue={userInfo.userName}
        {...register("userName")}
      ></Input>
      {errors.oldPassword && (
        <MyArlertNotice>{errors.oldPassword.message}</MyArlertNotice>
      )}
      {errorMess && <MyArlertNotice>{errorMess}</MyArlertNotice>}
      {isSuccess && (
        <MySuscesstNotice>
          Change account information successful
        </MySuscesstNotice>
      )}
      <Button type="submit" className="w-full  font-bold" variant="ghost">
        {isPending ? <Spinner /> : "Change"}
      </Button>
    </form>
  );
}
