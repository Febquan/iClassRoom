// import MyNavBar from "../components/MyNavBar";
// import MyFooter from "../components/MyFooter";
import { useSelector } from "react-redux";
import NavBar from "./NavBar";
import SideNav from "./SideNav";
import { RootState } from "@/store/store";
import { Toaster } from "@/components/ui/toaster";
export default function Layout({ children }: { children: React.ReactNode }) {
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  return (
    <>
      <div className=" isolate  ">
        <NavBar className=" relative z-[2]"></NavBar>
        <div
          className={`relative z-[1]  ${isLogin ? "grid" : ""}`}
          style={{
            gridTemplateColumns: "1fr 100fr",
          }}
        >
          {isLogin && <SideNav></SideNav>}
          <div className="relative w-full ">{children}</div>
        </div>
        <div></div>
      </div>
      <Toaster></Toaster>
    </>
  );
}
