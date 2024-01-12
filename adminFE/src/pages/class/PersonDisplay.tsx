import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ClassToStudent, Role } from "@/ultis/appType";

import { UpperFirstLetter } from "@/ultis/classFunctions";

export default function PersonDisplay({
  i,
  personInfo,
  isClassOwner,
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

      <div className=" flex gap-3">
        {personInfo.organizeId && personInfo.role == "student" && (
          <div className="w-[7rem] h-9">
            <Badge
              variant="outline"
              className="w-full h-full flex justify-center"
            >
              {personInfo.organizeId}
            </Badge>
          </div>
        )}
        <div className="w-[7rem] h-9 ">
          <Badge
            className="w-full h-full flex justify-center"
            variant="outline"
          >
            {isClassOwner ? (
              <span>Owner</span>
            ) : (
              <span>{UpperFirstLetter(personInfo.role)}</span>
            )}
          </Badge>
        </div>
      </div>
    </div>
  );
}
