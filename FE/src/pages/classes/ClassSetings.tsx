import { ReactNode } from "react";
import LeaveClassForm from "./LeaveClassForm";
import ManageClassRole from "./ManageClassRole";
import { useGetClassRole, useIsOwner } from "../customhook/classCustomHooks";
import ManageClassStudentId from "./ManageClassStudentId";
import UploadExtraStudentInfo from "./UploadExtraStudentInfo";
import ChangeClassStudentId from "./ChangeClassStudentId";

export default function ClassSetings() {
  const isOwner = useIsOwner();
  const userClassRole = useGetClassRole();
  return (
    <div className=" flex flex-col xl:w-[50rem] w-full gap-6 justify-center items-center">
      {isOwner && (
        <>
          <MySection title="Manage class role">
            <ManageClassRole></ManageClassRole>
          </MySection>
          <MySection title="Manage Student Id">
            <ManageClassStudentId></ManageClassStudentId>
          </MySection>
          <MySection title="Upload Student Info">
            <UploadExtraStudentInfo></UploadExtraStudentInfo>
          </MySection>
        </>
      )}
      {userClassRole == "student" && (
        <MySection title="Change Student Id">
          <ChangeClassStudentId></ChangeClassStudentId>
        </MySection>
      )}
      <MySection title="Leave Class">
        <LeaveClassForm></LeaveClassForm>
      </MySection>
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
    <div className="relative flex flex-col gap-3 h-fit w-full  border-solid border-2 p-[3rem] rounded-lg">
      <h1 className="scroll-m-20 text-2xl font-bold tracking-tight ">
        {title}
      </h1>
      {children}
    </div>
  );
};
