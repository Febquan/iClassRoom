import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
const PrivateRoute = () => {
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  return isLogin ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default PrivateRoute;
