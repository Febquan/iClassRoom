import {
  useGetClassId,
  useGetMyInfoInClass,
} from "../customhook/classCustomHooks";
import { Button } from "@/components/ui/button";
import api from "@/axios/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MyError } from "@/ultis/appType";
import Spinner from "@/components/ui/spinner";
import FormError from "./FormError";
import { useState } from "react";
import PersonDisplayEditStudentId from "./PersonDisplayEditStudentId";

export default function ChangeClassStudentId() {
  const info = useGetMyInfoInClass();

  const queryClient = useQueryClient();
  const [errorMess, setErrorMess] = useState<string>();
  const classId = useGetClassId();
  const [changedInfo, setChangeInfo] = useState<string | undefined>(
    info?.organizeId
  );
  const isChange = info?.organizeId !== changedInfo;
  const studentIdChange = async (changedInfo: string | undefined) => {
    await api.post("user/class/changeMyStudentId", {
      userId: info?.userId,
      newOrganizeId: changedInfo,
      classId,
    });
  };
  const { mutate, isPending } = useMutation({
    mutationFn: studentIdChange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`Class-${classId}`] });
    },
    onError: (error) => {
      const err = error as MyError;
      setErrorMess(err.response?.data.error);
    },
  });

  const onStudentIdChange = () => {
    setErrorMess("");
    mutate(changedInfo);
  };

  const onChangeStudentId = (_: string, studentId: string) => {
    setChangeInfo(studentId);
  };
  return (
    <div className=" w-full flex flex-col gap-5">
      <ul className=" w-full flex-col flex gap-5">
        {info && (
          <PersonDisplayEditStudentId
            i={`${info.student.email}${1}`}
            personInfo={info}
            changeStudentId={onChangeStudentId}
            isChange={isChange}
          ></PersonDisplayEditStudentId>
        )}
      </ul>
      {errorMess && <FormError>{errorMess}</FormError>}
      <Button className="mt-3" onClick={onStudentIdChange}>
        {isPending ? <Spinner></Spinner> : "Change"}
      </Button>
    </div>
  );
}
