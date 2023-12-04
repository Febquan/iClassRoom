import PageSetting from "../layout/PageSetting";
import ChangePasswordForm from "./ChangePasswordForm";
export default function AccountSetting() {
  return (
    <PageSetting className="flex flex-col justify-center items-center gap-10">
      <div className="relative flex flex-col gap-3 h-fit w-[50rem]  border-solid border-2 p-[3rem] rounded-lg">
        <h1 className="scroll-m-20 text-2xl font-bold tracking-tight ">
          Change Password
        </h1>
        <ChangePasswordForm></ChangePasswordForm>
      </div>

      <div className="relative flex flex-col gap-3 h-fit w-[50rem]  border-solid border-2 p-[3rem] rounded-lg">
        <h1 className="scroll-m-20 text-2xl font-bold tracking-tight ">
          Change Password
        </h1>
        <ChangePasswordForm></ChangePasswordForm>
      </div>
    </PageSetting>
  );
}
