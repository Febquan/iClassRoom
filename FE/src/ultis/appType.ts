import { AxiosError } from "axios";

export type Role = "student" | "teacher";
export type UserInfo = {
  userId: string;
  email: number;
  userName: string;
  avatar: string;
  isOauth: boolean;
};

export type Class = {
  id: string;
  className: string;
  createBy: string;
  createdAt: string;
  haveStudent: ClassToStudent[];
};
export type userToClass = {
  id: string;
  class: Class;
  courseId: string;
  organizeId: string;
  role: Role;
  userId: string;
};

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
export type Student = {
  avatar: string;
  email: string;
  userName: string;
};
export type ClassToStudent = {
  courseId: string;
  organizeId: string;
  role: Role;
  userId: string;
  student: Student;
};
export type ClassInfo = Class & { post: Post[] };
export const ROLE = ["teacher", "student"] as const;

export type MyError = AxiosError<{ success: boolean; error: string }>;
