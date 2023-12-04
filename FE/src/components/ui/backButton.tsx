import { ArrowLeft } from "lucide-react";
import { HTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export default function BackButton(props: HTMLAttributes<HTMLButtonElement>) {
  const navigate = useNavigate();
  return (
    <Button
      {...props}
      onClick={() => {
        navigate(-1);
      }}
      variant="link"
      className={`text-foreground ${props.className} `}
    >
      <ArrowLeft></ArrowLeft>
    </Button>
  );
}
