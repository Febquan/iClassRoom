import { ReactNode, useEffect, useState } from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Sidebar from "../layout/SideBar";
import SidebarItem from "../layout/SideBarItem";
import {
  School,
  Mails,
  Settings,
  LibraryBig,
  UserCircleIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type SideBarContent = {
  icon: ReactNode;
  text: string;
  alert: boolean;
  active: boolean;
  children: SideBarLink[];
};
type SideBarLink = {
  active: boolean;
  text: string;
  alert: boolean;
  url: string;
  icon: ReactNode;
};
const SideBarContent: SideBarContent[] = [
  {
    icon: <School />,
    text: "School",
    alert: true,
    active: false,
    children: [
      {
        active: false,
        text: "Classes",
        alert: true,
        url: "/classes",
        icon: <LibraryBig />,
      },
    ],
  },
  {
    icon: <Mails />,
    text: "News",
    alert: true,
    active: false,
    children: [
      {
        active: false,
        text: "Classes",
        alert: true,
        url: "/classes",
        icon: <LibraryBig />,
      },
    ],
  },
  {
    icon: <Settings />,
    text: "Settings",
    alert: true,
    active: false,
    children: [
      {
        active: false,
        text: "Account",
        alert: true,
        url: "/settings/account",
        icon: <UserCircleIcon />,
      },
    ],
  },
];

export default function SideNav() {
  const navigate = useNavigate();
  const HandleNavigate = (pageUrl: string) => {
    navigate(pageUrl);
  };
  const isOpen = useSelector((state: RootState) => state.sideBar.isOpen);
  const isOpenHover = useSelector(
    (state: RootState) => state.sideBar.isOpenHover
  );
  // const open = isOpen || isOpenHover;

  const [accorItem, setAccorItem] = useState([""]);
  useEffect(() => {
    if (!isOpen) {
      setAccorItem([""]);
    }
  }, [isOpen]);
  return (
    <Sidebar isOpen={isOpen} isOpenHover={isOpenHover}>
      <Accordion
        type="multiple"
        className="w-full"
        value={accorItem}
        onValueChange={setAccorItem}
      >
        {SideBarContent.map((val, i) => (
          <AccordionItem
            value={`item${i}`}
            key={`item${i}`}
            onMouseEnter={() => {
              if (isOpen) return;
              setAccorItem([`item${i}`]);
            }}
            onMouseLeave={() => {
              if (isOpen) return;
              setAccorItem([""]);
            }}
          >
            <AccordionTrigger>
              <SidebarItem
                icon={val.icon}
                text={val.text}
                active={val.active}
                alert={val.alert}
              ></SidebarItem>
            </AccordionTrigger>
            <AccordionContent>
              {val.children.map((child, j) => (
                <div className=" flex" key={`item${i}${j}`}>
                  <div className="w-8"></div>
                  <SidebarItem
                    icon={child.icon}
                    text={child.text}
                    active={child.active}
                    alert={child.alert}
                    onClick={() => {
                      HandleNavigate(child.url);
                    }}
                  ></SidebarItem>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Sidebar>
  );
}
