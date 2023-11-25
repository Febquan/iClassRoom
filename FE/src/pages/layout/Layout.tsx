// import MyNavBar from "../components/MyNavBar";
// import MyFooter from "../components/MyFooter";

import NavBar from "./NavBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" isolate  ">
      <NavBar className=" relative z-[2]"></NavBar>
      <div className="relative z-[1]">{children}</div>
      <div></div>
    </div>
  );
}
