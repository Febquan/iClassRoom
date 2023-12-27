import {
  useGetClassExtraInfo,
  useUserClassClassify,
} from "../customhook/classCustomHooks";
import { Separator } from "@/components/ui/separator";

import PersonDisplay from "./PersonDisplay";
import { DataTable } from "@/components/ui/data-table";

import { ColumnDef } from "@tanstack/react-table";
import { ClassToStudent, ExtraTable, Role, Student } from "@/ultis/appType";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UpperFirstLetter,
  createColumnOnDynamicFields,
  excludeField,
} from "@/ultis/classFunctions";
import { ArrowUpDown } from "lucide-react";
import Spinner from "@/components/ui/spinner";

const columns: ColumnDef<ClassToStudent>[] = [
  {
    accessorKey: "student",
    header: () => <div className="text-center">Account</div>,
    cell: ({ row }) => {
      const student: Student = row.getValue("student");

      return (
        <div className="flex gap-2 items-center  ">
          <Avatar className="h-[40px] w-[42px]">
            <AvatarImage src={student?.avatar} alt="@shadcn" />
            <AvatarFallback>{student?.userName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-[0.8rem] font-medium leading-non">
              {student?.userName}
            </span>
            <span className="text-[0.6rem] text-muted-foreground">
              {student?.email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "organizeId",
    header: ({ column }) => (
      <div className=" flex gap-2 justify-center items-center">
        <span>Student id</span>

        <ArrowUpDown
          className=" cursor-pointer"
          size={14}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        />
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role: Role = row.getValue("role");
      return UpperFirstLetter(role);
    },
  },
];

export default function ClassRosters() {
  const { teachers, students, classOwner } = useUserClassClassify();
  const extraInfo = useGetClassExtraInfo();
  if (!extraInfo)
    return (
      <div className="  w-full   flex flex-col gap-5">
        <ul className=" w-full flex-col flex gap-5">
          {classOwner &&
            classOwner?.map((el, i) => (
              <PersonDisplay
                i={`${el.student.email}${i}`}
                personInfo={el}
                isClassOwner={true}
              ></PersonDisplay>
            ))}
        </ul>
        <Separator></Separator>
        <ul className=" w-full flex-col flex gap-5">
          {teachers &&
            teachers?.map((el, i) => (
              <PersonDisplay
                i={`${el.student.email}${i}`}
                personInfo={el}
              ></PersonDisplay>
            ))}
        </ul>
        <Separator className="mb-5"></Separator>
        <ul className=" w-full flex-col flex gap-5">
          {students &&
            students?.map((el, i) => (
              <PersonDisplay
                i={`${el.student.email}${i}`}
                personInfo={el}
              ></PersonDisplay>
            ))}
        </ul>
      </div>
    );

  const excludeInfo = excludeField(extraInfo[0], "Student Id");
  const mappingStudentId = () => {
    if (students && students?.length > 0 && extraInfo && extraInfo.length > 0) {
      return extraInfo.map((extraInfo) => {
        const student = students.find(
          (el) => el.organizeId == extraInfo["Student Id"]
        );
        // extraStudentInfo && delete extraStudentInfo["Student Id"];

        if (student) {
          return { ...excludeInfo, ...student };
        } else {
          return {
            ...excludeInfo,
            ...({
              courseId: "",
              organizeId: extraInfo["Student Id"],
              role: "student",
              userId: "Unknow",
              student: {
                userName: "Unregistered",
                avatar: "",
                email: "",
              },
            } as ClassToStudent),
          };
        }
      });
    }
  };
  const mappedId: string[] = extraInfo.map((el) => el["Student Id"].toString());
  const erorrMappedStudent = students?.filter(
    (el) => !mappedId.includes(el.organizeId)
  );

  let newColumn: (ColumnDef<ClassToStudent> | ColumnDef<ExtraTable>)[] = [];
  const map = mappingStudentId();

  if (!map || !erorrMappedStudent) return <Spinner></Spinner>;
  const mappedStudents = [...map, ...erorrMappedStudent];
  if (extraInfo) {
    newColumn = [
      ...columns,
      ...createColumnOnDynamicFields(Object.keys(excludeInfo)),
    ];
  }

  return (
    <div className="  w-full   flex flex-col gap-5">
      <ul className=" w-full flex-col flex gap-5">
        {classOwner &&
          classOwner?.map((el, i) => (
            <PersonDisplay
              i={`${el.student.email}${i}`}
              personInfo={el}
              isClassOwner={true}
            ></PersonDisplay>
          ))}
      </ul>
      <Separator></Separator>
      <ul className=" w-full flex-col flex gap-5">
        {teachers &&
          teachers?.map((el, i) => (
            <PersonDisplay
              i={`${el.student.email}${i}`}
              personInfo={el}
            ></PersonDisplay>
          ))}
      </ul>
      <Separator className="mb-5"></Separator>
      {mappedStudents && (
        <DataTable
          columns={newColumn as ColumnDef<ClassToStudent, unknown>[]}
          data={mappedStudents}
        ></DataTable>
      )}
    </div>
  );
}
