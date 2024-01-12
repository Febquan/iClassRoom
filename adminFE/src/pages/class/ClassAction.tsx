import BackButton from "@/components/ui/backButton";
// import { useAdminGetSpecificClass } from "../customhook/cusHook";
import ClassRosters from "./ClassRosters";
import ClassSetings from "./ClassSetings";
// import { Separator } from "@/components/ui/separator";
export default function ClassAction() {
  //   const { classInfo, isPending } = useAdminGetSpecificClass();
  return (
    <div className="p-[5rem] flex flex-col gap-10 justify-center items-center">
      <BackButton className=" absolute left-5 top-5"></BackButton>
      <ClassRosters></ClassRosters>
      <ClassSetings></ClassSetings>
    </div>
  );
}
