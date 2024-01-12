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

  return (
    <div className="">
      <img
        src="https://iclassroom.s3.ap-southeast-1.amazonaws.com/public-img/1704891749709-986092079null-128400605_2781792772137993_8412963163183832126_n.png"
        alt=""
      />
    </div>
  );
}
