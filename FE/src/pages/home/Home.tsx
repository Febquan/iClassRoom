import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const url = localStorage.getItem("initUrl");
  useEffect(() => {
    if (url && url !== `${import.meta.env.VITE_FRONT_END_URL}`) {
      localStorage.removeItem("initUrl");
      window.location.href = url;
    }
  }, [navigate, url]);

  return <div className="">home</div>;
}
