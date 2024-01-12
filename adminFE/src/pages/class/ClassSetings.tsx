import { ReactNode } from "react";

import ManageClassRole from "./ManageClassRole";

import ManageClassStudentId from "./ManageClassStudentId";
import UploadExtraStudentInfo from "./UploadExtraStudentInfo";

export default function ClassSetings() {
  return (
    <div className=" flex flex-col xl:w-[50rem] w-full gap-6 justify-center items-center">
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
