import api from "@/axios/axios";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

import { ClassInfo } from "../classes/ClassPost";
import { ClassToStudent, Role, UserInfo, userToClass } from "@/ultis/appType";
import { useParams } from "react-router-dom";
import { useState } from "react";

export const useGetAllUSerClass = (userId: string) => {
  const { toast } = useToast();
  const fetchAllClass = async () => {
    try {
      const res = await api.get(`user/class/getAllClass/${userId}`);
      const addedIndexClasses = res.data.classes.map((el: userToClass) => {
        return { ...el, id: el.courseId };
      });
      return addedIndexClasses;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      console.log(err);
    }
  };
  const { data: classes, isSuccess } = useQuery<userToClass[] | undefined>({
    queryKey: ["userClasses"],
    queryFn: fetchAllClass,
  });

  return { classes, isSuccess };
};

export const useGetClassInfo = (classId: string) => {
  const getClassContent = async () => {
    const res = await api.get(`/user/class/getClassContent/${classId}`);
    return res.data.classInfo;
  };
  const { data: classInfo } = useQuery<ClassInfo | undefined>({
    queryKey: [`Class-${classId}`],
    queryFn: getClassContent,
  });
  return { classInfo };
};

export const useGetUserInfo = () => {
  const { data: userInfo } = useQuery<UserInfo | undefined>({
    queryKey: ["userInfo"],
  });

  return { userInfo };
};

export const useUserClassClassify = () => {
  const classId = useGetClassId();
  const { classInfo } = useGetClassInfo(classId!);
  const initClassClassify: ClassToStudent[] = JSON.parse(
    JSON.stringify(classInfo?.haveStudent)
  );
  console.log(initClassClassify, "xxxx");
  const [userInClass, setUserInclass] = useState<ClassToStudent[] | undefined>(
    initClassClassify
  );
  const teachers = userInClass?.filter((el) => el.role === "teacher");
  const students = userInClass?.filter((el) => el.role === "student");
  const classOwner = userInClass?.filter(
    (el) => el.userId === classInfo?.createBy
  );

  const changeRole = (email: string, role: Role) => {
    // setClassifyState(prev=> {...prev, students})
    const copy = JSON.parse(JSON.stringify(userInClass));
    const userIndex = userInClass?.findIndex((el) => el.student.email == email);
    copy![userIndex!].role = role;

    setUserInclass([...copy]);
  };

  const getChangeUsers = (): {
    userId: string;
    newRole: Role;
  }[] => {
    const changedUser = [];

    for (const user of initClassClassify) {
      const afterRole = userInClass?.find(
        (el) => el.userId == user.userId
      )?.role;
      const initRole = user.role;
      if (initRole != afterRole) {
        changedUser.push({
          userId: user.userId,
          newRole: afterRole!,
        });
      }
    }

    return changedUser;
  };

  return { teachers, students, classOwner, changeRole, getChangeUsers };
};

export const useIsOwner = () => {
  const { userInfo } = useGetUserInfo();
  const { classes } = useGetAllUSerClass(userInfo!.userId);
  const classId = useGetClassId();
  const classAuthor = classes?.find((el) => el.courseId == classId)?.class
    .createBy;

  return classAuthor == userInfo?.userId;
};

export const useGetMyRole = () => {
  const { userInfo } = useGetUserInfo();
  const { classes } = useGetAllUSerClass(userInfo!.userId);
  const classId = useGetClassId();
  const roleInClass = classes?.find((el) => el.courseId == classId)?.role;
  return roleInClass;
};

export const useGetClassId = () => {
  const { classId } = useParams();
  return classId;
};
