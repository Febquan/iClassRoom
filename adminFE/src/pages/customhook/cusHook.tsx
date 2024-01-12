import api from "@/axios/axios";
import { toast, useToast } from "@/components/ui/use-toast";
import { Class, ClassToStudent, Role, UserInfo } from "@/ultis/appType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const useGetClassId = () => {
  const { classId } = useParams();
  return classId;
};
export const useGetUserInfo = () => {
  const { data: userInfo } = useQuery<UserInfo | undefined>({
    queryKey: ["userInfo"],
  });

  return { userInfo };
};

export const useAdminGetAllClass = () => {
  const { toast } = useToast();
  const fetchAllClass = async () => {
    try {
      const res = await api.get(`admin/class/getAllClass/`);
      return res.data.classes;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      console.log(err);
    }
  };
  const { data: classes, isSuccess } = useQuery<Class[] | undefined>({
    queryKey: ["allClasses"],
    queryFn: fetchAllClass,
  });

  return { classes, isSuccess };
};
export const useAdminGetAllUser = () => {
  const { toast } = useToast();
  const fetchAllUser = async () => {
    try {
      const res = await api.get(`admin/account/getAllUser`);
      return res.data.users;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      console.log(err);
    }
  };
  const { data: users, isSuccess } = useQuery<UserInfo[] | undefined>({
    queryKey: ["allUsers"],
    queryFn: fetchAllUser,
  });

  return { users, isSuccess };
};

export const useAdminGetSpecificClass = () => {
  const classId = useGetClassId();
  const { toast } = useToast();
  const fetchAllClass = async () => {
    try {
      const res = await api.get(`admin/class/getSpecificClass/${classId}`);
      return res.data.class;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      console.log(err);
    }
  };
  const { data, isPending } = useQuery<Class | undefined>({
    queryKey: [`Class-${classId}`],
    queryFn: fetchAllClass,
  });

  return { classInfo: data, isPending };
};

export const useGetClassExtraInfo = () => {
  const { classInfo } = useAdminGetSpecificClass();
  return classInfo?.studentExtraInfo;
};

export const useUserStudentClassId = () => {
  const { classInfo } = useAdminGetSpecificClass();
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

export const useUserClassClassify = () => {
  const { classInfo } = useAdminGetSpecificClass();

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

export const useActiveClass = () => {
  const onSetActive = async ({
    id,
    isActive,
  }: {
    id: string;
    isActive: boolean;
  }) => {
    await api.post("admin/class/inactiveClass", {
      classId: id,
      active: !isActive,
    });
  };
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: onSetActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allClasses"] });
      toast({
        title: "Success change class status",
      });
    },
    onError: () => {
      toast({
        title: "Failed to change class status",
        variant: "destructive",
      });
    },
  });
  return mutate;
};

export const useDeleteClass = () => {
  const onDeleteClass = async ({ id }: { id: string }) => {
    await api.post("admin/class/deleteClass", {
      classId: id,
    });
  };
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: onDeleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allClasses"] });
      toast({
        title: "Success delete class ",
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete class ",
        variant: "destructive",
      });
    },
  });
  return mutate;
};

export const useLockUser = () => {
  const onSetActive = async ({
    id,
    isLock,
  }: {
    id: string;
    isLock: boolean;
  }) => {
    console.log(id, isLock, "dsfsddf");
    await api.post("admin/account/lockUser", {
      userId: id,
      isLock: !isLock,
    });
  };
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: onSetActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      toast({
        title: "Success change account status",
      });
    },
    onError: () => {
      toast({
        title: "Failed to change account status",
        variant: "destructive",
      });
    },
  });
  return mutate;
};

export const useDeleteUser = () => {
  const onSetActive = async ({ id }: { id: string }) => {
    await api.post("admin/account/deleteUser", {
      userId: id,
    });
  };
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: onSetActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      toast({
        title: "Success delete account ",
      });
    },
    onError: () => {
      toast({
        title: "Failed to delete account",
        variant: "destructive",
      });
    },
  });
  return mutate;
};
const checkStudentId = (inputString: string) => {
  const regex = /^.+$/;
  return regex.test(inputString);
};
