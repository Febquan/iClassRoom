import BackButton from "@/components/ui/backButton";
import { ReactNode, createContext, useEffect, useState } from "react";
import PageSetting from "./PageSetting";
import { ChevronLeft } from "lucide-react";
import {
  useGetClassId,
  useGetClassPage,
  useGetClassRole,
} from "../customhook/classCustomHooks";
import { useNavigate } from "react-router-dom";
import { tabOptions } from "@/ultis/appType";

export interface PageContextType {
  classPage: string;
  setClassPage: React.Dispatch<React.SetStateAction<string>>;
}

export const PageContext = createContext<PageContextType | undefined>(
  undefined
);
export default function PageContent({
  tabOptions,
  children,
  defaultTab,
}: {
  tabOptions: tabOptions;
  children: ReactNode;
  defaultTab: string;
}) {
  const [openClassNav, setOpenClassNav] = useState<boolean>(false);
  const [classPage, setClassPage] = useState<string>(defaultTab);
  const contextValue = {
    classPage,
    setClassPage,
  };
  const tabPage = useGetClassPage();
  const classId = useGetClassId();
  const navigate = useNavigate();
  const role = useGetClassRole();

  useEffect(() => {
    tabPage && setClassPage(tabPage);
  }, [classId, navigate, tabPage]);
  return (
    <PageSetting
      className={`gap-5 flex justify-center items-center transition-all ${
        openClassNav && "mr-[15rem]"
      } `}
    >
      <BackButton className="absolute left-5 top-5"></BackButton>
      <PageContext.Provider value={contextValue}>
        {children}
      </PageContext.Provider>

      <div
        className={`  backdrop-filter backdrop-blur-sm bg-opacity-0  transition-all flex justify-center items-start py-[3rem] fixed  border-t-0 h-full top-0 right-0 mt-[3.9rem] border-solid border-2  ${
          openClassNav ? "w-[15rem]" : "w-0"
        }  `}
      >
        <div className="flex flex-col gap-5 w-fit overflow-hidden">
          {tabOptions.map((el, i) => {
            return (
              <>
                {(role == el.role || el.role == "all") && (
                  <div
                    key={i}
                    className={`flex gap-2 cursor-pointer rounded-xl p-3 transition-all  ${
                      classPage === el.id && "bg-accent"
                    }`}
                    onClick={() => {
                      setClassPage(el.id);
                      navigate(`/classes/${classId}/${el.id}`);
                    }}
                  >
                    {el.icon}
                    <span className=" font-semibold">{el.text}</span>
                  </div>
                )}
              </>
            );
          })}
        </div>
        <div className=" absolute left-[-4rem] top-[50vh]">
          <div
            onClick={() => {
              setOpenClassNav((prev) => !prev);
            }}
            className={`  border-solid border-2 p-2 rounded-full hover:bg-accent transition-all ${
              openClassNav ? " rotate-180" : ""
            }  `}
          >
            <span>
              <ChevronLeft></ChevronLeft>
            </span>
          </div>
        </div>
      </div>
    </PageSetting>
  );
}
