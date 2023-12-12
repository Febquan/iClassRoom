import Post from "./Post";
import CreatePost from "./CreatePost";

import {
  useGetClassId,
  useGetClassInfo,
  useGetUserInfo,
} from "../customhook/classCustomHooks";
import { Class } from "@/ultis/appType";

export type ClassInfo = Class & { post: Post[] };

export type Post = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  authorId: string;
  isPrivate: boolean;
  fileKeys: string[];
  receiverId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comments: any;
};

export default function ClassPost() {
  const classId = useGetClassId();
  const { classInfo } = useGetClassInfo(classId!);
  const { userInfo } = useGetUserInfo();
  const sortedPost = classInfo?.post.sort((a, b) => {
    const timeA = new Date(a.createdAt);
    const timeB = new Date(b.createdAt);

    return timeB.getTime() - timeA.getTime();
  });
  return (
    <div className=" grid  gap-7  xl:w-[50rem]  relative">
      <div className="flex flex-col gap-5">
        {userInfo && classInfo && (
          <CreatePost userInfo={userInfo} classInfo={classInfo}></CreatePost>
        )}

        {sortedPost?.map((postData, i) => (
          <Post
            key={i}
            postData={postData}
            classUserInfo={classInfo!.haveStudent}
          ></Post>
        ))}
      </div>
    </div>
  );
}
