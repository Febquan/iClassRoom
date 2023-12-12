import { Separator } from "@/components/ui/separator";
import PersonDisplay from "./PersonDisplay";

import {
  useGetClassId,
  useUserClassClassify,
} from "../customhook/classCustomHooks";
import { Button } from "@/components/ui/button";
import api from "@/axios/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MyError, Role } from "@/ultis/appType";
import Spinner from "@/components/ui/spinner";
import FormError from "./FormError";
import { useState } from "react";

export default function ManageClassRole() {
  const { teachers, students, classOwner, changeRole, getChangeUsers } =
    useUserClassClassify();
  const queryClient = useQueryClient();
  const [errorMess, setErrorMess] = useState<string>();
  const classId = useGetClassId();
  const changedInfo = getChangeUsers();
  const changedUsers = changedInfo.map((el) => el.userId);
  const RoleChange = async (
    changedInfo: {
      userId: string;
      newRole: Role;
    }[]
  ) => {
    await api.post("user/class/changeUserRole", { changedInfo, classId });
  };
  const { mutate, isPending } = useMutation({
    mutationFn: RoleChange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`Class-${classId}`] });
    },
    onError: (error) => {
      const err = error as MyError;
      setErrorMess(err.response?.data.error);
      console.log(err.response?.data.error);
    },
  });
  const onRoleChange = () => {
    mutate(changedInfo);
  };
  return (
    <div className=" w-full flex flex-col gap-5">
      <ul className=" w-full flex-col flex gap-5">
        {classOwner?.map((el, i) => (
          <PersonDisplay
            i={`${el.student.email}${i}`}
            personInfo={el.student!}
            role="Owner"
            isEdit={false}
            changeRole={changeRole}
          ></PersonDisplay>
        ))}
      </ul>
      <Separator></Separator>
      <ul className=" w-full flex-col flex gap-5">
        {teachers?.map((el, i) => (
          <PersonDisplay
            i={`${el.student.email}${i}`}
            personInfo={el.student!}
            role="Teacher"
            isEdit={true}
            changeRole={changeRole}
            isChange={changedUsers.includes(el.userId)}
          ></PersonDisplay>
        ))}
      </ul>
      <Separator></Separator>
      <ul className=" w-full flex-col flex gap-5">
        {students?.map((el, i) => (
          <PersonDisplay
            i={`${el.student.email}${i}`}
            personInfo={el.student!}
            role="Student"
            isEdit={true}
            changeRole={changeRole}
            isChange={changedUsers.includes(el.userId)}
          ></PersonDisplay>
        ))}
      </ul>
      {errorMess && <FormError>{errorMess}</FormError>}
      <Button className="mt-3" onClick={onRoleChange}>
        {isPending ? <Spinner></Spinner> : "Change"}
      </Button>
    </div>
  );
}
