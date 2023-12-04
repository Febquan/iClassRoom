import { GraduationCap } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { AlignJustify } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "../../components/mode-toggle";
import { toggleSideBar } from "../../store/sideBarSlice";
import { logoutSetState } from "@/store/authSlice";
import api from "@/axios/axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { UserInfo } from "@/ultis/appType";
import { useToast } from "@/components/ui/use-toast";

export default function NavBar({ className }: { className: string }) {
  const { data } = useQuery<UserInfo | undefined>({
    queryKey: ["userInfo"],
    refetchOnWindowFocus: false,
  });
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const handleOpen = () => {
    dispatch(toggleSideBar());
  };
  const handleLogout = async () => {
    try {
      await api.post("/user/auth/logout");
      dispatch(logoutSetState());
      navigate("/login");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      console.log(err);
    }
  };
  return (
    <div className={className}>
      <div className="h-[4rem]"></div>
      <div className=" fixed top-0 h-[4rem] w-[100vw] border-b-2 p-[0.6rem]  px-[3rem]  flex justify-between   bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-0">
        <div className=" absolute top-[0.8rem] left-[0.7rem]">
          {isLogin && (
            <Button variant="outline" onClick={handleOpen}>
              <AlignJustify></AlignJustify>
            </Button>
          )}
        </div>
        <div className=" px-[2rem] flex justify-center items-center gap-2 ml-[3rem] ">
          <GraduationCap size={40} />
          <a href="/" className="font-bold ">
            IClassRoom
          </a>
        </div>
        <div className="flex items-center gap-3">
          {isLogin && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex gap-2 items-center ">
                    <Avatar className="h-[40px] w-[42px]">
                      <AvatarImage src={data?.avatar} alt="@shadcn" />
                      <AvatarFallback>{data?.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-[0.8rem] font-medium leading-non">
                        {data?.userName}
                      </span>
                      <span className="text-[0.6rem] text-muted-foreground">
                        {data?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          <ModeToggle></ModeToggle>
        </div>
      </div>
    </div>
  );
}
