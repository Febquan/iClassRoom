import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
export default function EmailChangeSent() {
  const navigate = useNavigate();
  const { email } = useParams();
  return (
    <div className=" h-[calc(100vh-5.2rem)] flex justify-center items-center flex-col gap-4 ">
      <span className="font-extrabold text-[2rem] text-center">
        We have sent an email to <br />
        {email} <br />
      </span>
      <span className=" text-muted-foreground text-[1rem] font-light   ">
        to change your password please visit the link included
      </span>
      <Button
        onClick={() => {
          navigate("/login");
        }}
      >
        Ok !
      </Button>
    </div>
  );
}
