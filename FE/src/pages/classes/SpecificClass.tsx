import { Share2, Settings, Megaphone, PersonStanding } from "lucide-react";

import ClassPost from "./ClassPost";
import ClassRosters from "./ClassRosters";
import PageContentItem from "../layout/PageContentItem";
import PageContent from "../layout/PageContent";
import { ClassShare } from "./ClassShare";
import ClassSetings from "./ClassSetings";

const tabOptions = [
  {
    icon: <Megaphone></Megaphone>,
    id: "classPost",
    text: "Post",
  },
  {
    icon: <Share2></Share2>,
    id: "classShare",
    text: "Share",
  },
  {
    icon: <PersonStanding></PersonStanding>,
    id: "classRosters",
    text: "Rosters",
  },
  {
    icon: <Settings></Settings>,
    id: "classSettings",
    text: "Class settings",
  },
];
export default function SpecificClass() {
  return (
    <PageContent tabOptions={tabOptions} defaultTab="classPost">
      <PageContentItem tabName="classPost">
        <ClassPost></ClassPost>
      </PageContentItem>
      <PageContentItem tabName="classShare">
        <ClassShare></ClassShare>
      </PageContentItem>
      <PageContentItem tabName="classRosters">
        <ClassRosters></ClassRosters>
      </PageContentItem>

      <PageContentItem tabName="classSettings">
        <ClassSetings></ClassSetings>
      </PageContentItem>
    </PageContent>
  );
}
