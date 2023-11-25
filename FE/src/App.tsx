import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./ultis/PrivateRoute.js";
import Layout from "./pages/layout/Layout.jsx";
import Auth from "./pages/auth/Auth.js";
import Home from "./pages/home/Home.js";
import Unauthorized from "./pages/error/Unauthorized";
import EmailVerify from "./pages/other/EmailVerify";

import api from "./axios/axios.js";
import { useDispatch } from "react-redux";
import { useEffect, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { loginSetState } from "./store/authSlice.js";
function App() {
  const [checkAutologin, setCheckAutoLogin] = useState<boolean>(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const autoLogin = useCallback(async () => {
    try {
      console.log("lmaoooo");
      const res = await api.get("user/auth/autologin");
      console.log("lmaoooo", res.data.userInfo, res.data);

      if (res.data.success) {
        console.log("lmaooodfd");
        dispatch(loginSetState());
        queryClient.setQueryData(["userInfo"], res.data.userInfo);
      }
      setCheckAutoLogin(true);
    } catch (err) {
      console.log(err);
    }
  }, [dispatch, queryClient]);
  // const { isSuccess, isError } = useQuery({
  //   queryKey: ["userInfo"],
  //   queryFn: autoLogin,
  //   // Set to false to stop automatic refetching
  // });
  // console.log(isSuccess);
  useEffect(() => {
    autoLogin();
  }, [autoLogin, dispatch]);

  return (
    <>
      {checkAutologin && (
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/login" element={<Auth />} />
              <Route element={<PrivateRoute />}>
                <Route element={<Home />} path="/home" />
                <Route element={<Home />} path="/" />
              </Route>
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/emailVerify/:email" element={<EmailVerify />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
