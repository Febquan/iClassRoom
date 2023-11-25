import { RootState } from "@/store/store";
import { ReactNode } from "react";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setOpenHoverSideBar } from "@/store/sideBarSlice";
export default function Sidebar({ children }: { children: ReactNode }) {
  const isOpen = useSelector((state: RootState) => state.sideBar.isOpen);
  const isOpenHover = useSelector(
    (state: RootState) => state.sideBar.isOpenHover
  );
  //   const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  const dispatch = useDispatch();
  const handleOpenSideBar = () => {
    dispatch(setOpenHoverSideBar(true));
  };
  const handleCloseSideBar = () => {
    dispatch(setOpenHoverSideBar(false));
  };

  return (
    <aside
      className={`h-screen fixed transition-width duration-300 ease-in-out ${
        isOpen || isOpenHover ? "w-[15rem]" : "w-[5rem]"
      }`}
    >
      <nav className="h-full  py-[3rem]  border-r shadow-sm   ">
        <div>
          <ul
            className="flex-1 px-3 "
            onMouseEnter={handleOpenSideBar}
            onMouseLeave={handleCloseSideBar}
          >
            <div> {children}</div>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
