import { useGetClassId, useUserStudentClassId } from "../customhook/cusHook";
import { Button } from "@/components/ui/button";
import api from "@/axios/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MyError } from "@/ultis/appType";
import Spinner from "@/components/ui/spinner";
import FormError from "./FormError";
import { useState } from "react";
import PersonDisplayEditStudentId from "./PersonDisplayEditStudentId";

export default function ManageClassStudentId() {
  const { students, changeStudentId, getChangeUsers, getErrorUser } =
    useUserStudentClassId();
  const queryClient = useQueryClient();
  const [errorMess, setErrorMess] = useState<string>();
  const classId = useGetClassId();
  const changedInfo = getChangeUsers();
  const errorUsers = getErrorUser();
  const changedUsers = changedInfo.map((el) => el.userId);
  const studentIdChange = async (
    changedInfo: {
      userId: string;
      newStudentId: string;
    }[]
  ) => {
    await api.post("admin/class/changeStudentId", { changedInfo, classId });
  };
  const { mutate, isPending } = useMutation({
    mutationFn: studentIdChange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`Class-${classId}`] });
    },
    onError: (error) => {
      const err = error as MyError;
      setErrorMess(err.response?.data.error);
      console.log(err.response?.data.error);
    },
  });

  const onStudentIdChange = () => {
    mutate(changedInfo);
  };

  return (
    <div className=" w-full flex flex-col gap-5">
      <ul className=" w-full flex-col flex gap-5">
        {students?.map((el, i) => (
          <PersonDisplayEditStudentId
            i={`${el.student.email}${i}`}
            personInfo={el}
            changeStudentId={changeStudentId}
            isChange={changedUsers.includes(el.userId)}
            ErrorMes={
              errorUsers.find((user) => user.userId === el.userId)?.errorMes
            }
          ></PersonDisplayEditStudentId>
        ))}
      </ul>
      {errorMess && <FormError>{errorMess}</FormError>}
      <Button
        className="mt-3"
        onClick={onStudentIdChange}
        disabled={!(errorUsers.length == 0) || changedInfo.length == 0}
      >
        {isPending ? <Spinner></Spinner> : "Change"}
      </Button>
    </div>
  );
}
