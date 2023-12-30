import api from "@/axios/axios";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

import { ClassInfo } from "../classes/ClassPost";
import {
  ClassToStudent,
  GradePart,
  Role,
  UserInfo,
  userToClass,
} from "@/ultis/appType";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

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
  const { toast } = useToast();
  const getClassContent = async () => {
    const res = await api.get(`/user/class/getClassContent/${classId}`);
    return res.data.classInfo;
  };
  const { data: classInfo, isError } = useQuery<ClassInfo | undefined>({
    queryKey: [`Class-${classId}`],
    queryFn: getClassContent,
  });
  useEffect(() => {
    if (isError) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Cant request to this class.",
      });
    }
  }, [isError, toast]);
  return { classInfo };
};

export const useGetUserInfo = () => {
  const { data: userInfo } = useQuery<UserInfo | undefined>({
    queryKey: ["userInfo"],
  });

  return { userInfo };
};

export const useGetAllStudentInClass = () => {
  const classId = useGetClassId();
  const { classInfo } = useGetClassInfo(classId!);
  const students = classInfo?.haveStudent?.filter(
    (el) => el.role === "student"
  );
  return students;
};

export const useUserClassClassify = () => {
  const classId = useGetClassId();
  const { classInfo } = useGetClassInfo(classId!);

  const initClassClassify = JSON.parse(
    JSON.stringify(classInfo?.haveStudent ? classInfo.haveStudent : [])
  );
  const [userInClass, setUserInclass] = useState<ClassToStudent[] | undefined>(
    initClassClassify
  );
  useEffect(() => {
    setUserInclass(classInfo?.haveStudent);
  }, [classInfo?.haveStudent]);

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

const checkStudentId = (inputString: string) => {
  const regex = /^.+$/;
  return regex.test(inputString);
};

export const useUserStudentClassId = () => {
  const classId = useGetClassId();
  const { classInfo } = useGetClassInfo(classId!);
  const initClass: ClassToStudent[] = JSON.parse(
    JSON.stringify(classInfo?.haveStudent ? classInfo.haveStudent : [])
  );
  const [userInClass, setUserInclass] = useState<ClassToStudent[] | undefined>(
    initClass
  );
  useEffect(() => {
    setUserInclass(classInfo?.haveStudent);
  }, [classInfo?.haveStudent]);

  const students = userInClass?.filter((el) => el.role === "student");

  const changeStudentId = (userId: string, studentId: string) => {
    const copy: ClassToStudent[] = JSON.parse(JSON.stringify(userInClass));
    const userIndex = userInClass?.findIndex((el) => el.userId == userId);
    copy![userIndex!].organizeId = studentId;

    setUserInclass([...copy]);
  };

  const getErrorUser = (): {
    userId: string;
    errorMes: string;
  }[] => {
    if (!userInClass) return [];
    const errorUser = [];
    for (const el of userInClass) {
      if (!checkStudentId(el.organizeId) && el.role == "student") {
        errorUser.push({ userId: el.userId, errorMes: "Invalid Id" });
      }
      if (
        userInClass.find(
          (el2) => el2.organizeId == el.organizeId && el2.userId != el.userId
        )
      ) {
        errorUser.push({ userId: el.userId, errorMes: "Id already exist" });
      }
    }
    return errorUser;
  };

  const getChangeUsers = (): {
    userId: string;
    newStudentId: string;
  }[] => {
    const changedUser = [];

    for (const user of initClass) {
      const afterStudentId = userInClass?.find(
        (el) => el.userId == user.userId
      )?.organizeId;
      const initRole = user.organizeId;
      if (initRole != afterStudentId) {
        changedUser.push({
          userId: user.userId,
          newStudentId: afterStudentId!,
        });
      }
    }

    return changedUser;
  };

  return { students, changeStudentId, getErrorUser, getChangeUsers };
};

export const useGetClassExtraInfo = () => {
  const classId = useGetClassId();
  const { classInfo } = useGetClassInfo(classId!);

  return classInfo?.studentExtraInfo;
};
export const useGetRegisterStudentId = () => {
  const ClassStudentIdInfo = useGetClassExtraInfo();
  return ClassStudentIdInfo?.map((student) => String(student["Student Id"]));
};

export const useIsOwner = () => {
  const { userInfo } = useGetUserInfo();
  const classId = useGetClassId();
  const { classInfo } = useGetClassInfo(classId!);
  const classAuthor = classInfo?.createBy;

  return classAuthor == userInfo?.userId;
};

export const useGetClassRole = () => {
  const { userInfo } = useGetUserInfo();
  const classId = useGetClassId();
  const { classInfo } = useGetClassInfo(classId!);
  const role = classInfo?.haveStudent.find(
    (el) => el.userId == userInfo?.userId
  )?.role;
  return role;
};

export const useGetMyInfoInClass = () => {
  const { userInfo } = useGetUserInfo();
  const classId = useGetClassId();
  const { classInfo } = useGetClassInfo(classId!);
  return classInfo?.haveStudent.find((el) => el.userId == userInfo?.userId);
};

export const useGetUserPublicInfo = (userId: string) => {
  const students = useGetAllStudentInClass();
  return students?.find((student) => student.userId == userId);
};

export const useGetClassId = () => {
  const { classId } = useParams();
  return classId;
};
export const useGetClassPage = () => {
  const { tabPage } = useParams();
  return tabPage;
};

export const useGetClassGrade = () => {
  const { toast } = useToast();
  const classId = useGetClassId();
  const getClassGrade = async () => {
    const res = await api.get(`/user/class/getClassGrade/${classId}`);
    return res.data.classGrade;
  };
  const { data: classGrade, isError } = useQuery<GradePart[] | undefined>({
    queryKey: [`Class-Grade-${classId}`],
    queryFn: getClassGrade,
  });
  useEffect(() => {
    if (isError) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Cant request to this class.",
      });
    }
  }, [isError, toast]);
  return classGrade;
};

export const useGetStudentGrade = () => {
  const { toast } = useToast();
  const classId = useGetClassId();
  const userId = useGetUserInfo().userInfo?.userId;
  const getStudentClassGrade = async () => {
    const res = await api.get(
      `/user/class/getStudentGrade/${classId}/${userId}`
    );
    return res.data.studentGrade;
  };
  const { data: classGrade, isError } = useQuery<GradePart[] | undefined>({
    queryKey: [`Student-Grade-${userId}-${classId}`],
    queryFn: getStudentClassGrade,
  });
  useEffect(() => {
    if (isError) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Cant request to this class.",
      });
    }
  }, [isError, toast]);
  return classGrade;
};
