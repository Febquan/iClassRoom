import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Comment() {
  return (
    <div>
      <div className="flex gap-2 items-start">
        <div className=" flex flex-col justify-center items-center gap-3">
          <Avatar className="h-[40px] w-[42px] mt-1">
            <AvatarImage alt="@shadcn" />
            <AvatarFallback>T</AvatarFallback>
          </Avatar>
          <span className="text-[0.6rem] text-muted-foreground">20/4</span>
        </div>
        <div className="relative flex flex-col gap-1 h-fit w-full border-solid border-2 p-[1rem] rounded-3xl">
          <div className="flex  items-center">
            <span className="text-md font-bold leading-non">Quan :</span>
          </div>
          <p className="text-[0.8rem]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
            quasi, delectus dolor similique nostrum ea ipsam! Recusandae, magni
            provident ut architecto, sint dolores libero excepturi asperiores
            facere nisi hic earum!
          </p>
        </div>
      </div>
    </div>
  );
}
