import { CopyIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useState } from "react";
import api from "@/axios/axios";

import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Spinner from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE } from "@/ultis/appType";

import {
  useGetClassId,
  useGetClassRole,
  useGetUserInfo,
  useIsOwner,
} from "../customhook/classCustomHooks";

export function ClassShare() {
  const classId = useGetClassId();
  const isOwner = useIsOwner();
  const roleInClass = useGetClassRole();
  const { userInfo } = useGetUserInfo();
  const isOwnnerOrTeacher = roleInClass == "teacher" || isOwner;

  return (
    <div className=" flex flex-col gap-8 w-full justify-center items-center">
      <div className=" h-fit xl:w-[50rem]  w-full border-solid border-2 p-[3rem] rounded-lg">
        <ShareByCode isOwnnerOrTeacher={isOwnnerOrTeacher}></ShareByCode>
      </div>

      <div className=" h-fit xl:w-[50rem]  w-full border-solid border-2 p-[3rem] rounded-lg">
        <ShareByLink isOwnnerOrTeacher={isOwnnerOrTeacher}></ShareByLink>
      </div>
      {isOwnnerOrTeacher && (
        <div className=" h-fit xl:w-[50rem] w-full border-solid border-2 p-[3rem] rounded-lg">
          <EmailInvite
            isOwnnerOrTeacher={isOwnnerOrTeacher}
            userName={userInfo!.userName}
            classId={classId!}
          ></EmailInvite>
        </div>
      )}
    </div>
  );
}

const Schema = z
  .object({
    emails: z.string().min(1, "Requied"),
    role: z.enum(ROLE),
  })
  .refine(
    (data) => {
      const emails = getEmailsFromString(data.emails);
      if (emails.length == 0) return false;
      for (const email of emails) {
        if (!emailCheck(email)) {
          return false;
        }
      }

      return true;
    },
    {
      message: `One or more email that is not a valid email`,
      path: ["emails"], // path of error
    }
  );
type SchemaType = z.infer<typeof Schema>;
const emailCheck = function (email: string) {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};
const getEmailsFromString = function (emails: string) {
  const s = emails?.trim().replace(/\s\s+/g, " ");
  return s ? s.split(" ") : [];
};
function EmailInvite({
  isOwnnerOrTeacher,
  userName,
  classId,
}: {
  isOwnnerOrTeacher: boolean;
  userName: string;
  classId: string;
}) {
  const { toast } = useToast();
  const [errorMess] = useState<string>();
  const [isLoading, setisLoading] = useState<boolean>();
  const form = useForm<SchemaType>({
    resolver: zodResolver(Schema),
  });

  async function onEmailInvite(data: SchemaType) {
    try {
      setisLoading(true);
      await api.post("user/class/emailInvite", {
        inviteUser: userName,
        classId,
        ...data,
        emails: getEmailsFromString(data.emails),
      });

      toast({
        variant: "default",
        title: "Emails sent.",
        description: "All valid email are sent",
        duration: 2000,
      });
      setisLoading(false);
    } catch (err) {
      // setErrorMess(err as string);
      console.log(err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request to the server.",
        duration: Infinity,
      });
      setisLoading(false);
    }
  }
  const watchEmail = form.watch("emails");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onEmailInvite)}
        className="space-y-3"
        id="classShare"
      >
        <FormField
          control={form.control}
          name="emails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invite Emails</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  defaultValue={""}
                  placeholder="Invite emails"
                  disabled={!isOwnnerOrTeacher}
                />
              </FormControl>
              <FormDescription>Input emails to invite</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!isOwnnerOrTeacher}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role for invited user" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>{" "}
                </SelectContent>
              </Select>
              <FormDescription>
                Emails with invitaion will be set as this role in class
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <ul className=" flex gap-3 flex-wrap">
          {getEmailsFromString(watchEmail)?.map((el, i) => (
            <>
              {emailCheck(el) ? (
                <li key={i}>
                  <Badge
                    variant="secondary"
                    className="text-[1rem] px-5 relative"
                  >
                    {el}
                  </Badge>
                </li>
              ) : (
                <li key={i}>
                  <Badge
                    variant="destructive"
                    className="text-[1rem] px-5 relative"
                  >
                    {el}
                  </Badge>
                </li>
              )}
            </>
          ))}
        </ul>
        {errorMess && (
          <span className="text-red-500 text-center w-full block ">
            {errorMess}
          </span>
        )}
        <Button type="submit" className="w-full  font-bold" variant="ghost">
          {!isLoading ? (
            isOwnnerOrTeacher ? (
              "Send invite"
            ) : (
              "You dont have permission to invite people to class"
            )
          ) : (
            <Spinner></Spinner>
          )}
        </Button>
      </form>
    </Form>
  );
}

function ShareByLink({ isOwnnerOrTeacher }: { isOwnnerOrTeacher: boolean }) {
  const classId = useGetClassId();
  const { toast } = useToast();
  const [studentCode, setStudentCode] = useState("");
  const [teacherCode, setTeacherCode] = useState("");
  const getInviteLink = useCallback(() => {
    let apiArray = [
      api.get(`user/class/getStudentInviteLink/${classId}`),
      api.get(`user/class/getTeacherInviteLink/${classId}`),
    ];
    if (!isOwnnerOrTeacher) {
      apiArray = [api.get(`user/class/getStudentInviteLink/${classId}`)];
    }

    Promise.all(apiArray)
      .then((values) => {
        setStudentCode(values[0].data.link);
        if (isOwnnerOrTeacher) {
          setTeacherCode(values[1].data.link);
        }
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
  }, [classId, isOwnnerOrTeacher, toast]);
  useEffect(() => {
    getInviteLink();
  }, [getInviteLink, isOwnnerOrTeacher]);

  return (
    <div className="w-full  flex items-center relative  flex-col gap-4">
      <h1 className="scroll-m-20 text-2xl font-bold tracking-tight ">
        Share by link
      </h1>
      <div className="w-full  ">
        <Label htmlFor="link" className="">
          Invite link for students :
        </Label>
        <div className="flex flex-1 gap-2">
          <Input id="link" readOnly value={studentCode} />
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={() => {
              navigator.clipboard.writeText(studentCode);
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

      {isOwnnerOrTeacher && (
        <div className="w-full">
          <Label htmlFor="link" className="">
            Invite link for teachers :
          </Label>
          <div className="flex flex-1 gap-2">
            <Input
              id="link"
              readOnly
              value={teacherCode}
              disabled={!isOwnnerOrTeacher}
            />
            <Button
              disabled={!isOwnnerOrTeacher}
              type="submit"
              size="sm"
              className="px-3"
              onClick={() => {
                navigator.clipboard.writeText(teacherCode);
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
      )}
    </div>
  );
}

function ShareByCode({ isOwnnerOrTeacher }: { isOwnnerOrTeacher: boolean }) {
  const classId = useGetClassId();
  const { toast } = useToast();
  const [studentCode, setStudentCode] = useState("");
  const [teacherCode, setTeacherCode] = useState("");
  const getInvitecode = useCallback(() => {
    let apiArray = [
      api.get(`user/class/getStudentInviteCode/${classId}`),
      api.get(`user/class/getTeacherInviteCode/${classId}`),
    ];
    if (!isOwnnerOrTeacher) {
      apiArray = [api.get(`user/class/getStudentInviteCode/${classId}`)];
    }

    Promise.all(apiArray)
      .then((values) => {
        setStudentCode(values[0].data.code);
        if (isOwnnerOrTeacher) {
          setTeacherCode(values[1].data.code);
        }
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
  }, [classId, isOwnnerOrTeacher, toast]);
  useEffect(() => {
    getInvitecode();
  }, [getInvitecode, isOwnnerOrTeacher]);

  return (
    <div className="w-full  flex items-center relative  flex-col gap-4">
      <h1 className="scroll-m-20 text-2xl font-bold tracking-tight ">
        Share by code
      </h1>
      <div className="w-full  ">
        <Label htmlFor="code" className="">
          Invite code for students :
        </Label>
        <div className="flex flex-1 gap-2">
          <Input id="code" readOnly value={studentCode} />
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={() => {
              navigator.clipboard.writeText(studentCode);
              toast({
                description: "Copied invite code for students !",
                duration: 2000,
              });
            }}
          >
            <span className="sr-only">Copy</span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isOwnnerOrTeacher && (
        <div className="w-full">
          <Label htmlFor="code" className="">
            Invite code for teachers :
          </Label>
          <div className="flex flex-1 gap-2">
            <Input
              id="code"
              readOnly
              value={teacherCode}
              disabled={!isOwnnerOrTeacher}
            />
            <Button
              disabled={!isOwnnerOrTeacher}
              type="submit"
              size="sm"
              className="px-3"
              onClick={() => {
                navigator.clipboard.writeText(teacherCode);
                toast({
                  description: "Copied invite code for teachers !",
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
      )}
    </div>
  );
}
