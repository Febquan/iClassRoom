import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./ultis/PrivateRoute.js";
import Layout from "./pages/layout/Layout.jsx";
import Auth from "./pages/auth/Auth.js";
import Home from "./pages/home/Home.js";
import ClassPage from "./pages/classes/ClassPage.js";
import SpecificClass from "./pages/classes/SpecificClass.js";
import Unauthorized from "./pages/error/Unauthorized";
import EmailVerify from "./pages/other/EmailVerify";

import api from "./axios/axios.js";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { loginSetState } from "./store/authSlice.js";
import AcceptInvite from "./pages/classes/AcceptInvite.js";
// import { useToast } from "@/components/ui/use-toast";
import AccountSetting from "./pages/settings/AccountSetting.js";
import { UserInfo } from "./ultis/appType.js";
import EmailChangePassword from "./pages/auth/EmailChangePassword.js";
import EmailChangeSent from "./pages/other/EmailChangeSent.js";

import NewsPage from "./pages/news/NewsPage.js";
import LockClass from "./ultis/LockClass.js";
import ClassBlocked from "./pages/error/ClassBlocked.js";
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
      const res = await api.get("user/auth/autologin");

      if (res.data.success) {
        dispatch(loginSetState());
      }
      return res.data.userInfo;
    } catch (err) {
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
                <Route element={<ClassPage />} path="/classes" />
                <Route
                  element={<AcceptInvite />}
                  path="/classes/acceptinvite/:hashedClassId"
                />

                <Route element={<LockClass />}>
                  <Route
                    element={<SpecificClass />}
                    path="/classes/:classId/:tabPage"
                  />
                  <Route
                    element={<SpecificClass />}
                    path="/classes/:classId/:tabPage/:elementId"
                  />
                </Route>
                <Route element={<AccountSetting />} path="/settings/account" />
                <Route element={<NewsPage />} path="/news" />
              </Route>

              <Route
                path="/emailChangeSent/:email"
                element={<EmailChangeSent />}
              />

              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/classBlocked" element={<ClassBlocked />} />

              <Route path="/emailVerify/:email" element={<EmailVerify />} />
              <Route
                path="/emailChangePassword/:token"
                element={<EmailChangePassword />}
              />
            </Routes>
          </Layout>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
