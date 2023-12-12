import { useUserClassClassify } from "../customhook/classCustomHooks";
import { Separator } from "@/components/ui/separator";

import PersonDisplay from "./PersonDisplay";
export default function ClassRosters({ isEdit }: { isEdit: boolean }) {
  const { teachers, students, classOwner } = useUserClassClassify();

  return (
    <div className=" w-[50rem] flex flex-col gap-5">
      <ul className=" w-full flex-col flex gap-5">
        {classOwner?.map((el, i) => (
          <PersonDisplay
            i={`${el.student.email}${i}`}
            personInfo={el.student!}
            role="Owner"
            isEdit={isEdit}
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
            isEdit={isEdit}
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
            isEdit={isEdit}
          ></PersonDisplay>
        ))}
      </ul>
    </div>
  );
}
