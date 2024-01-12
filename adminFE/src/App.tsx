import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./ultis/PrivateRoute.js";
import Layout from "./pages/layout/Layout.jsx";
import Auth from "./pages/auth/Auth.js";
import Home from "./pages/home/Home.js";
import Unauthorized from "./pages/error/Unauthorized";

import api from "./axios/axios.js";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { loginSetState } from "./store/authSlice.js";

// import { useToast } from "@/components/ui/use-toast";
import ClassManagement from "./pages/class/class.js";
import { UserInfo } from "./ultis/appType.js";
import ClassAction from "./pages/class/ClassAction.js";
import Account from "./pages/account/account.js";
import EmailChangePassword from "./pages/auth/EmailChangePassword.js";
import EmailChangeSent from "./pages/other/EmailChangeSent.js";

function App() {
  // const { toast } = useToast();

  const [checkAutologin, setCheckAutoLogin] = useState<boolean>(false);
  const dispatch = useDispatch();
  useEffect(() => {
    if (window.location.href == `${import.meta.env.VITE_FRONT_END_URL}`) {
      return;
    }
    localStorage.setItem("initUrl", window.location.href);
    setTimeout(() => {
      localStorage.removeItem("initUrl");
    }, 2000);
  }, []);

  const autoLogin = async () => {
    try {
      const res = await api.get("admin/auth/autologin");
      console.log(res);
      if (res.data.success) {
        dispatch(loginSetState());
      }
      return res.data.userInfo;
    } catch (err) {
      // console.log(err);
      window.location.href = `${
        import.meta.env.VITE_FRONT_END_URL
      }unauthorized`;
    }
  };
  const { isSuccess } = useQuery<UserInfo | undefined>({
    queryKey: ["userInfo"],
    queryFn: autoLogin,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    console.log(isSuccess);
    if (isSuccess) {
      setCheckAutoLogin(true);
    }
  }, [dispatch, isSuccess]);

  return (
    <>
      {checkAutologin && (
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/login" element={<Auth />} />
              <Route element={<PrivateRoute />}>
                {/* <Route element={<Home />} path="/home" /> */}
                <Route element={<Home />} path="" />
                <Route
                  element={<ClassManagement></ClassManagement>}
                  path="/classes"
                />
                <Route
                  element={<ClassAction></ClassAction>}
                  path="/classAction/:classId"
                />
                <Route element={<Account></Account>} path="/account" />
              </Route>
              <Route
                path="/emailChangeSent/:email"
                element={<EmailChangeSent />}
              />
              <Route
                path="/emailChangePassword/:token"
                element={<EmailChangePassword />}
              />
              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
