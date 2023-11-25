import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div className=" h-[calc(100vh-5.2rem)] flex justify-center items-center flex-col gap-4 ">
      <span className="font-extrabold text-[4rem]">Unauthorized</span>
      <Button
        onClick={() => {
          navigate("/login");
        }}
      >
        Please login !
      </Button>
    </div>
  );
}
