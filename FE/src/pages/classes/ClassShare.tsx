import { CopyIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import api from "@/axios/axios";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export function ClassShare() {
  const { classId } = useParams();
  const { toast } = useToast();
  const [studentInviteLink, setStudentInviteLink] = useState("");
  const [teacherInviteLink, setTeacherInviteLink] = useState("");
  const getInviteLink = useCallback(() => {
    // const res1 = await api.get(`user/class/getStudentInviteLink/${classId}`);
    // setStudentInviteLink(res1.data.link);
    // const res2 = await api.get(`user/class/getTeacherInviteLink/${classId}`);
    // setTeacherInviteLink(res2.data.link);
    Promise.all([
      api.get(`user/class/getStudentInviteLink/${classId}`),
      api.get(`user/class/getTeacherInviteLink/${classId}`),
    ])
      .then((values) => {
        console.log(values);
        setStudentInviteLink(values[0].data.link);
        setTeacherInviteLink(values[0].data.link);
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request to the server.",
          duration: Infinity,
        });
        console.log(err);
      });
  }, [classId, toast]);
  useEffect(() => {
    getInviteLink();
  }, [getInviteLink]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2></Share2>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-y-5 flex-col w-full">
          <div className="w-full  ">
            <Label htmlFor="link" className="">
              Invite link for students :
            </Label>
            <div className="flex flex-1 gap-2">
              <Input id="link" readOnly value={studentInviteLink} />
              <Button
                type="submit"
                size="sm"
                className="px-3"
                onClick={() => {
                  navigator.clipboard.writeText(studentInviteLink);
                  toast({
                    description: "Copied invite link for students !",
                    duration: 2000,
                  });
                }}
              >
                <span className="sr-only">Copy</span>
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="w-full">
            <Label htmlFor="link" className="">
              Invite link for teachers :
            </Label>
            <div className="flex flex-1 gap-2">
              <Input id="link" readOnly value={teacherInviteLink} />
              <Button
                type="submit"
                size="sm"
                className="px-3"
                onClick={() => {
                  navigator.clipboard.writeText(teacherInviteLink);
                  toast({
                    description: "Copied invite link for teachers !",
                    duration: 2000,
                    dir: "left",
                  });
                }}
              >
                <span className="sr-only">Copy</span>
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
