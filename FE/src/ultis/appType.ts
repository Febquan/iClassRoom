import { AxiosError } from "axios";
import { ReactNode } from "react";

export type NoticeType =
  | "post"
  | "gradeReview"
  | "finalizeGrade"
  | "gradeReviewChat";
export type Role = "student" | "teacher";
export type UserInfo = {
  userId: string;
  email: number;
  userName: string;
  avatar: string;
  isOauth: boolean;
  isLock: boolean;
};
export type News = {
  id: string;
  content: string;
  isUnRead: boolean;
  userId: string;
  classId: string;
  target: string;
  type: NoticeType;
};

export type Class = {
  id: string;
  className: string;
  createBy: string;
  createdAt: string;
  haveStudent: ClassToStudent[];
  studentExtraInfo: ExtraTable[];
  isActive: boolean;
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
  fileKeys: string[];
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
  id: string;
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
  isOnline: boolean;
  deadLine?: Date;
  content: TestContent;
};

export type TestContent = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  content: string;
  title: string;
  fileKeys: string[];
  files?: File[];
  classId: string;
  receiver: PrivateTestPostReceiver[];
};

export type PrivateTestPostReceiver = {
  id: string;
  receiverId: string;
  contentId: string;
  comments: PrivateCommentTest[];
};

export type PrivateCommentTest = {
  id: string;
  createdAt: string;
  authorId: string;
  content: string;
  postId: string;
};

export type ExtraInfo = {
  "Student Id": string;
};

export type FileTestPointUpload = {
  "Student Id": string;
  Point: number;
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
  grade: "classGrade" as const,
  settings: "classSettings" as const,
};
export const DEFAULT_TAB = ClassTab.post;
