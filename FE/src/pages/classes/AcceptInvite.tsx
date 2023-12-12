import { useNavigate } from "react-router-dom";
import api from "@/axios/axios";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { Class } from "@/ultis/appType";
import { useCallback, useEffect, useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { useGetUserInfo } from "../customhook/classCustomHooks";

export default function AcceptInvite() {
  const { hashedClassId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userInfo } = useGetUserInfo();
  const [classInfo, setClassInfo] = useState<
    Class & { role: "teacher" | "student" }
  >();
  const alreadyInClass = classInfo?.haveStudent.find(
    ({ userId }) => userId === userInfo?.userId
  );

  const getClassInviteInfo = useCallback(async () => {
    const res = await api.get(`user/class/getClassInviteInfo/${hashedClassId}`);
    console.log(res);
    setClassInfo(res.data.class);
  }, [hashedClassId]);

  useEffect(() => {
    getClassInviteInfo();
  }, [getClassInviteInfo]);
  const acceptInvitation = async () => {
    try {
      await api.post("user/class/acceptInvite", {
        hashedClassId,
        userId: userInfo?.userId,
      });
      navigate("/classes");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      console.log(err);
    }
  };
  return (
    <>
      {!alreadyInClass ? (
        <div className=" h-[calc(100vh-5.2rem)] flex justify-center items-center flex-col gap-4 ">
          <span className="font-extrabold text-[3rem]">
            You have been invited to
          </span>
          <div>
            {classInfo && (
              <span className="font-extrabold text-[2rem]">
                {classInfo.className} as a {classInfo.role}
              </span>
            )}
          </div>

          <Button
            onClick={() => {
              acceptInvitation();
            }}
          >
            Accept Invitation
          </Button>
        </div>
      ) : (
        <div className=" h-[calc(100vh-5.2rem)] flex justify-center items-center flex-col gap-4 ">
          <span className="font-extrabold text-[3rem]">
            You are already in this class
          </span>
          <div>
            {classInfo && (
              <span className="font-extrabold text-[2rem]">
                {classInfo.className} as a {classInfo.role}
              </span>
            )}
          </div>

          <Button
            onClick={() => {
              navigate("/classes");
            }}
          >
            OK !
          </Button>
        </div>
      )}
    </>
  );
}
