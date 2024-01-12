import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ClassToStudent, Role } from "@/ultis/appType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PersonDisplayEditRole({
  i,
  personInfo,
  changeRole,
  isChange,
}: {
  i: string;
  isClassOwner?: boolean;
  personInfo: ClassToStudent;
  changeRole?: (userId: string, role: Role) => void;
  isChange?: boolean;
}) {
  return (
    <div
      key={i}
      className={`flex justify-between items-center  p-2 ${
        isChange && " border-solid border-2 rounded-xl border-primary "
      }`}
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

      <div className="w-[7rem] h-9 ">
        <Select
          onValueChange={(val) => {
            changeRole && changeRole(personInfo.student.email, val as Role);
          }}
          defaultValue={personInfo.role.toLowerCase()}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role for invited user" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
