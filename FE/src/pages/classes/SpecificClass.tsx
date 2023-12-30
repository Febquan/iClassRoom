import {
  Share2,
  Settings,
  Megaphone,
  PersonStanding,
  BookA,
} from "lucide-react";

import ClassPost from "./ClassPost";
import ClassRosters from "./ClassRosters";
import PageContentItem from "../layout/PageContentItem";
import PageContent from "../layout/PageContent";
import { ClassShare } from "./ClassShare";
import ClassSetings from "./ClassSetings";
import { ClassTab, tabOptions as tabOptionsType } from "@/ultis/appType";
import TeacherClassGrading from "./TeacherClassGrading";

import { useGetClassRole } from "../customhook/classCustomHooks";
import StudentClassGrade from "./StudentClassGrade";
const tabOptions: tabOptionsType = [
  {
    icon: <Megaphone></Megaphone>,
    id: ClassTab.post,
    text: "Post",
    role: "all",
  },
  {
    icon: <Share2></Share2>,
    id: ClassTab.share,
    text: "Share",
    role: "all",
  },
  {
    icon: <PersonStanding></PersonStanding>,
    id: ClassTab.roster,
    text: "Rosters",
    role: "all",
  },
  {
    icon: <BookA></BookA>,
    id: ClassTab.grade,
    text: "Grade",
    role: "student",
  },
  {
    icon: <BookA></BookA>,
    id: ClassTab.grading,
    text: "Grading",
    role: "teacher",
  },
  {
    icon: <Settings></Settings>,
    id: ClassTab.settings,
    text: "Class settings",
    role: "all",
  },
];

export default function SpecificClass() {
  const role = useGetClassRole();
  return (
    <PageContent tabOptions={tabOptions} defaultTab="classPost">
      <PageContentItem tabName={ClassTab.post}>
        <ClassPost></ClassPost>
      </PageContentItem>
      <PageContentItem tabName={ClassTab.share}>
        <ClassShare></ClassShare>
      </PageContentItem>
      <PageContentItem tabName={ClassTab.roster}>
        <ClassRosters></ClassRosters>
      </PageContentItem>
      {role === "teacher" && (
        <PageContentItem tabName={ClassTab.grading}>
          <TeacherClassGrading></TeacherClassGrading>
        </PageContentItem>
      )}
      {role === "student" && (
        <PageContentItem tabName={ClassTab.grade}>
          <StudentClassGrade></StudentClassGrade>
        </PageContentItem>
      )}
      <PageContentItem tabName={ClassTab.settings}>
        <ClassSetings></ClassSetings>
      </PageContentItem>
    </PageContent>
  );
}
