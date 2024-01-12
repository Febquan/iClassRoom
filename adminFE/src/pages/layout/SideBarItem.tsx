import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ReactNode } from "react";

export default function SidebarItem({
  icon,
  text,
  active,
  alert,
  ...rest
}: {
  icon?: ReactNode;
  text: string;
  active: boolean;
  alert: boolean;
} & React.HTMLProps<HTMLLIElement>) {
  const isOpen = useSelector((state: RootState) => state.sideBar.isOpen);
  const isOpenHover = useSelector(
    (state: RootState) => state.sideBar.isOpenHover
  );

  return (
    <li
      {...rest}
      className={`
      ${rest.className}
        relative flex items-center py-2 px-5 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group 
        hover:bg-accent hover:text-accent-foreground
       w-full
        ${active ? "bg-card" : ""}
    `}
    >
      <div>{icon}</div>
      <span
        className={`overflow-hidden  ml-3 ${
          isOpen || isOpenHover ? "w-fit " : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-red-500   ${
            isOpen || isOpenHover ? "" : "top-[4px] right-[25px]"
          }`}
        />
      )}
    </li>
  );
}
