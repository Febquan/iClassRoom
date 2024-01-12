import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ClassToStudent } from "@/ultis/appType";

import { Input } from "@/components/ui/input";

export default function PersonDisplayEditStudentId({
  i,
  personInfo,
  changeStudentId,
  isChange,
  ErrorMes,
}: {
  i: string;
  isClassOwner?: boolean;
  personInfo: ClassToStudent;
  changeStudentId: (userId: string, studentId: string) => void;
  isChange: boolean;
  ErrorMes?: string;
}) {
  return (
    <div
      key={i}
      className={`flex justify-between items-center  p-2 ${
        isChange &&
        !ErrorMes &&
        " border-solid border-2 rounded-xl border-primary "
      }
      ${ErrorMes && " border-solid border-2 rounded-xl border-destructive "}
      `}
    >
      <div className="flex gap-2 items-center ">
        <Avatar className="h-[40px] w-[42px]">
          <AvatarImage src={personInfo.student?.avatar} alt="@shadcn" />
          <AvatarFallback>{personInfo.student?.userName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-[0.8rem] font-medium leading-non">
            {personInfo.student?.userName}
          </span>
          <span className="text-[0.6rem] text-muted-foreground">
            {personInfo.student?.email}
          </span>
        </div>
      </div>
      {ErrorMes && (
        <span className="text-[0.8rem] text-red-500 text-center ">
          {ErrorMes}
        </span>
      )}
      <div className="w-[7rem] h-9 ">
        <Input
          onChange={(el) => changeStudentId(personInfo.userId, el.target.value)}
          className="text-center"
          defaultValue={personInfo.organizeId}
        ></Input>
      </div>
    </div>
  );
}
