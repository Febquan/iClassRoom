import { AxiosError } from "axios";
import { ReactNode } from "react";

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
  studentExtraInfo: ExtraTable[];
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

  comments: Comment[];
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
export type Comment = {
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
};
export type GradePart = {
  id: string;
  name: string;
  scale: number;
  classID: string;
  sort: number;
  testid: Test[];
};
export type DoTest = {
  testId: string;
  studentId: string;
  point: number | null;
  pendingGradeReview: boolean;
  fileKeys: string[];
};
export type Test = {
  id: string;
  name: string;
  scale: number;
  isFinalize: boolean;
  gradePartId: string;
  doTest: DoTest[];
  sort: number;
};
export type ExtraInfo = {
  "Student Id": string;
};

export type DynamicObject = {
  [key: string]: string;
};
export type tabOptions = {
  icon: ReactNode;
  id: string;
  text: string;
  role: Role | "all";
}[];
export type ExtraTable = DynamicObject & ExtraInfo;

export type ClassInfo = Class & { post: Post[] };
export const ROLE = ["teacher", "student"] as const;

export type MyError = AxiosError<{ success: boolean; error: string }>;

export const ClassTab = {
  post: "classPost" as const,
  share: "classShare" as const,
  roster: "classRosters" as const,
  grading: "classGrading" as const,
  settings: "classSettings" as const,
};
export const DEFAULT_TAB = ClassTab.post;
