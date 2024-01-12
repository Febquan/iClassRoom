
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export default function ClassBlocked() {
  const navigate = useNavigate();
  return (
    <div className=" h-[calc(100vh-5.2rem)] flex justify-center items-center flex-col gap-4 ">
      <span className="font-extrabold text-[4rem]">Class is blocked by admin</span>
      <Button
        onClick={() => {
          navigate("/classes");
        }}
      >
        Return to class page
      </Button>
    </div>
  );
}