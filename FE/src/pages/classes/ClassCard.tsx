import {
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  Card,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

import { DEFAULT_TAB } from "@/ultis/appType";
import { LockIcon } from "lucide-react";

export default function ClassCard({
  id,
  className,
  myClassName,
  role,
  classId2,
  // organizeId,
  activeStatus,
  numberOfStudent,
  isOwnner,
  allStudent,
}: {
  id: string;
  myClassName: string;
  role: string;
  activeStatus: boolean;
  classId2: string;
  className?: string;
  numberOfStudent: number;
  isOwnner: boolean;
  allStudent: { name: string; src: string; studentClassId: string }[];
}) {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: id,
      transition: {
        duration: 250, // milliseconds
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      },
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <Card
      className={` relative hover:scale-[1.08]  transition-transform  ${className} h-[15rem] ${
        !activeStatus && " opacity-50"
      }`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        navigate(`/classes/${classId2}/${DEFAULT_TAB}`);
        window.scrollTo(0, 0);
      }}
    >
      {!activeStatus && (
        <LockIcon
          className="absolute left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%]"
          size={100}
        ></LockIcon>
      )}
      <CardHeader>
        <CardTitle className="text-[2rem]">{myClassName}</CardTitle>
        <Separator></Separator>
      </CardHeader>
      <CardContent className="space-y-2 flex flex-col gap-2  ">
        <div className="flex flex-col gap-2 ">
          <CardDescription className="p-5">
            {/* {organizeId && <span>Student id: {organizeId}</span>} */}
            <div className="flex  ">
              {allStudent.map((student, i) => (
                <Avatar className="ml-[-20px] h-[40px] w-[42px]" key={i}>
                  <AvatarImage src={student?.src} alt="@shadcn" />
                  <AvatarFallback>{student?.name[0]}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </CardDescription>
          <div className=" flex gap-2">
            <Badge
              className="w-fit"
              variant="secondary"
            >{`${role.toLocaleUpperCase()} `}</Badge>
            {isOwnner && (
              <Badge className="w-fit" variant="secondary">
                OWNER
              </Badge>
            )}
            <Badge variant="secondary" className=" font-semibold  ">
              SIZE {numberOfStudent}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center items-center w-full "></CardFooter>
    </Card>
  );
}
