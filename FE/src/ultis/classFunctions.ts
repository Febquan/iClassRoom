import api from "@/axios/axios";
import { userToClass } from "./appType";

export const fetchAllClass = async (userId: string) => {
  const res = await api.get(`user/class/getAllClass/${userId}`);
  const addedIndexClasses = res.data.classes.map((el: userToClass) => {
    return { ...el, id: el.courseId };
  });
  return addedIndexClasses;
};
