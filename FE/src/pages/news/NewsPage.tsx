import PageSetting from "../layout/PageSetting";
import News from "./News";
import { useGetUserNoti } from "../customhook/classCustomHooks";
import { News as NewsType } from "@/ultis/appType";
import Spinner from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/axios/axios";
export default function NewsPage() {
  const data: NewsType[] | undefined = useGetUserNoti();

  const queryClient = useQueryClient();
  const onClearRead = async () => {
    await api.post("user/class/clearReadNotification", {
      readNotiIds: read.map((r) => r.id),
    });
  };
  const { mutate, isPending } = useMutation({
    mutationFn: onClearRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Notifications"] });
      toast({
        title: "Clear all read Notifications",
      });
    },
    onError: () => {
      // const err = error as MyError;
      toast({
        title: "Clear all read Notifications",
        variant: "destructive",
      });
    },
  });
  if (!data) return <Spinner></Spinner>;
  const unread = data.filter((noti) => noti.isUnRead == true);
  const read = data.filter((noti) => noti.isUnRead == false);
  return (
    <PageSetting className="  flex justify-center items-center gap-10">
      <div className=" flex flex-col gap-5">
        <span className="text-5xl font-extrabold">What's new ?</span>
        <div className="flex flex-col-reverse gap-5 min-w-[50rem]">
          {unread.map((news, i) => (
            <News data={news} key={i}></News>
          ))}
        </div>
        <Separator></Separator>
        <div className=" flex justify-between">
          <span className="text-3xl font-extrabold">Already read</span>
          <Button
            variant="secondary"
            disabled={isPending}
            onClick={() => {
              mutate();
            }}
          >
            Clear
          </Button>
        </div>
        <div className="flex flex-col-reverse gap-5 min-w-[50rem] opacity-25">
          {read.map((news, i) => (
            <News data={news} key={i}></News>
          ))}
        </div>
      </div>
    </PageSetting>
  );
}
