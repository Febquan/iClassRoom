import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import PageSetting from "../layout/PageSetting";
import { ClassShare } from "./ClassShare";
import { EmailInvite } from "./EmailInvite";
import BackButton from "@/components/ui/backButton";
import { Class } from "./ClassPage";
import api from "@/axios/axios";
import Post from "./Post";
import CreatePost from "./CreatePost";
import { UserInfo } from "@/ultis/appType";
export type ClassInfo = Class & Post[];

type Post = {
  id: string;
  createAt: string;
  updatedAt: string;
  title: string;
  content: string;
  authorId: string;
};

export default function SpecificClass() {
  const { classId } = useParams();
  const getClassPost = async () => {
    const res = await api.get(`/user/class/getClassPost/${classId}`);
    return res.data.classInfo;
  };
  const { data: classInfo } = useQuery<ClassInfo | undefined>({
    queryKey: [`Class-${classId}`],
    queryFn: getClassPost,
  });
  const { data: userInfo } = useQuery<UserInfo | undefined>({
    queryKey: ["userInfo"],
  });
  return (
    <PageSetting className=" flex flex-col gap-5 relative justify-center items-center">
      <BackButton className="absolute left-5 top-5"></BackButton>
      <div className=" flex flex-col gap-7  lg:w-[50rem]">
        <div className=" flex gap-5 self-end">
          <ClassShare></ClassShare>
          <EmailInvite></EmailInvite>
        </div>
        <CreatePost userInfo={userInfo} classInfo={classInfo}></CreatePost>

        {[1, 2, 3, 4].map((el) => (
          <Post key={el}></Post>
        ))}
      </div>
    </PageSetting>
  );
}
