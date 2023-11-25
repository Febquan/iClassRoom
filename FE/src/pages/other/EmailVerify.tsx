import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
export default function EmailVerify() {
  const navigate = useNavigate();
  const { email } = useParams();
  return (
    <div className=" h-[calc(100vh-5.2rem)] flex justify-center items-center flex-col gap-4 ">
      <span className="font-extrabold text-[3rem] text-center">
        We have sent an email to <br />
        {email} <br />
        please verify your account
      </span>
      <Button
        onClick={() => {
          navigate("/login");
        }}
      >
        Already verified ? Login !
      </Button>
    </div>
  );
}
