import Sidebar from "../layout/SideBar";
import SidebarItem from "../layout/SideBarItem";
import { School, Mails, Settings } from "lucide-react";
export default function Home() {
  return (
    <div className="">
      <Sidebar>
        <SidebarItem
          icon={<School></School>}
          text="Classes"
          active={true}
          alert={true}
        ></SidebarItem>

        <SidebarItem
          icon={<Mails></Mails>}
          text="News"
          active={true}
          alert={false}
        ></SidebarItem>

        <SidebarItem
          icon={<Settings></Settings>}
          text="Settings"
          active={true}
          alert={false}
        ></SidebarItem>
      </Sidebar>
    </div>
  );
}
