import { News as NewsType, NoticeType } from "@/ultis/appType";
import { useNavigate } from "react-router-dom";
import {
  useGetAllUSerClass,
  useGetClassInfo,
  useGetUserInfo,
} from "../customhook/classCustomHooks";
import { Badge } from "@/components/ui/badge";
import api from "@/axios/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

const mappingTypeText: Record<NoticeType, string> = {
  gradeReview: `GRADE REVIEW`,
  finalizeGrade: `GRADE FINALIZE`,
  post: `NEW POST`,
  gradeReviewChat: `TEST COMMENT`,
};

export default function News({ data }: { data: NewsType }) {
  const navigate = useNavigate();
  const { userInfo } = useGetUserInfo();
  const { classes } = useGetAllUSerClass(userInfo!.userId);
  const { classInfo: people } = useGetClassInfo(data.classId);
  const role = people?.haveStudent.find(
    (el) => el.userId == userInfo?.userId
  )?.role;
  const classInfo = classes?.find(
    (myClass) => myClass.courseId == data.classId
  );
  const mappingPage: Record<NoticeType, string> = {
    gradeReview: `/classes/${data.classId}/classGrade/${data.target}`,
    finalizeGrade: `/classes/${data.classId}/classGrade/${data.target}`,
    post: `/classes/${data.classId}/classPost/${data.target}`,
    gradeReviewChat: `/classes/${data.classId}/${
      role == "teacher" ? "classGrading" : "classGrade"
    }/${data.target}`,
  };

  const onSetRead = async () => {
    await api.post("user/class/setReadNotification", {
      notiId: data.id,
    });
  };
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: onSetRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Notifications"] });
    },
    onError: () => {
      // Handle error if needed
      toast({
        title: "Failed to mark notification as read",
        variant: "destructive",
      });
    },
  });
  return (
    <div
      className={`hover:scale-[1.03] hover:bg-card transition-all relative flex flex-col gap-3 h-fit min-w-[50rem]  border-solid border-2  p-[2rem] rounded-lg`}
      onClick={async () => {
        try {
          navigate(mappingPage[data.type]);
          mutate();
        } catch (err) {
          console.log(err);
        }
      }}
    >
      <div className=" flex justify-between">
        <h1 className="scroll-m-20 text-xl font-bold tracking-tight ">
          <div className="text-2xl text-primary">
            <span>Class: </span>
            <span>{classInfo?.class.className}</span>
          </div>
          <span>{data.content}</span>
        </h1>
        <div>
          <Badge className="text-sm font-semibold">
            {mappingTypeText[data.type]}
          </Badge>
        </div>
      </div>
    </div>
  );
}
///classes/71e98ac2-55ff-405c-9249-83578831e06d/classGrade/d6fdf6db-8253-40d5-bed1-467575b898ec-621fb206-b2f3-454f-8088-6d7fd01f31a0
