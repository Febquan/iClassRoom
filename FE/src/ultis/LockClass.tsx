import api from "@/axios/axios";
import { useEffect, useState } from "react";
import { Outlet, Navigate, useParams } from "react-router-dom";

const PrivateRoute = () => {
  const { classId } = useParams();
  const [checkNotBlock, setCheckNotBlock] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const check = async () => {
      try {
        setLoading(true);
        await api.post("user/class/checkIsClassActive", { classId });
        setCheckNotBlock(true);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setCheckNotBlock(false);
        setLoading(false);
      }
    };
    check();
  }, [classId]);
  if (loading) return <></>;
  return checkNotBlock ? <Outlet /> : <Navigate to="/classBlocked" />;
};

export default PrivateRoute;
