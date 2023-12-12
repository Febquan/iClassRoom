import { ReactNode } from "react";
import LeaveClassForm from "./LeaveClassForm";
import ManageClassRole from "./ManageClassRole";
import { useIsOwner } from "../customhook/classCustomHooks";
export default function ClassSetings() {
  const isOwner = useIsOwner();
  return (
    <div className=" flex flex-col gap-6">
      <MySection title="Manage class role">
        <ManageClassRole></ManageClassRole>
      </MySection>
      {isOwner && (
        <MySection title="Leave Class">
          <LeaveClassForm></LeaveClassForm>
        </MySection>
      )}
    </div>
  );
}

const MySection = ({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) => {
  return (
    <div className="relative flex flex-col gap-3 h-fit w-[50rem]  border-solid border-2 p-[3rem] rounded-lg">
      <h1 className="scroll-m-20 text-2xl font-bold tracking-tight ">
        {title}
      </h1>
      {children}
    </div>
  );
};
