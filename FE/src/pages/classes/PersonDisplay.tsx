import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Role, Student } from "@/ultis/appType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PersonDisplay({
  i,
  personInfo,
  role,
  isEdit,
  changeRole,
  isChange,
}: {
  i: string;
  personInfo: Student;
  role: string;
  isEdit?: boolean;
  changeRole?: (userId: string, role: Role) => void;
  isChange?: boolean;
}) {
  return (
    <div
      key={i}
      className={`flex justify-between p-2 ${
        isChange && " border-solid border-2 rounded-xl border-primary "
      }`}
    >
      <div className="flex gap-2 items-center ">
        <Avatar className="h-[40px] w-[42px]">
          <AvatarImage src={personInfo?.avatar} alt="@shadcn" />
          <AvatarFallback>{personInfo?.userName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-[0.8rem] font-medium leading-non">
            {personInfo?.userName}
          </span>
          <span className="text-[0.6rem] text-muted-foreground">
            {personInfo?.email}
          </span>
        </div>
      </div>
      <div className="w-[7rem]">
        {isEdit ? (
          <Select
            onValueChange={(val) => {
              changeRole && changeRole(personInfo.email, val as Role);
            }}
            defaultValue={role.toLowerCase()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role for invited user" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>{" "}
            </SelectContent>
          </Select>
        ) : (
          <Badge
            className="w-full h-full flex justify-center"
            variant="outline"
          >
            <span>{role}</span>
          </Badge>
        )}
      </div>
    </div>
  );
}
