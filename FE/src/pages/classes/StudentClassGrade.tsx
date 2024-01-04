import Spinner from "@/components/ui/spinner";
import {
  useGetClassId,
  useGetStudentGrade,
  useGetUserInfo,
  useNewLink,
} from "../customhook/classCustomHooks";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  Globe,
  PenLineIcon,
  SendHorizontal,
  UploadCloudIcon,
} from "lucide-react";
import { MyError, Test } from "@/ultis/appType";
import parse from "html-react-parser";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dayjs from "@/ultis/myDayjs";
import { sortByTime } from "@/ultis/classFunctions";
import Comment from "./Comment";

export default function StudentClassGrade() {
  const studentGrade = useGetStudentGrade();
  useNewLink(studentGrade);
  if (!studentGrade) return <Spinner></Spinner>;
  const finalGrade = studentGrade
    .map((gradePart) => {
      const gradePartPoint = gradePart.testid.map((test) => {
        const point = test.doTest[0].point;
        return (point ? point : 0) * test.scale;
      });
      return gradePartPoint
        .map((point) => point * gradePart.scale)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    })
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const onlineTests = studentGrade
    .map((gradePart) =>
      gradePart.testid.map((test) => ({
        gradePartName: gradePart.name,
        ...test,
      }))
    )
    .flat()
    .filter((el) => el.isOnline == true);
  console.log(onlineTests, studentGrade);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className=" text-4xl text-center mb-5 font-bold"> Grade Table</h1>
      <div
        className={` border-solid border-[6px]  rounded-sm w-[60vw] h-fit   `}
      >
        <div className="overflow-auto scrollbar-none ">
          <div className="flex min-w-full  font-semibold    items-stretch ">
            <>
              {studentGrade.map((gradePart, i) => (
                <div
                  key={i}
                  className=" border-solid  min-w-[280px]  border-[2px] flex-1 justify-center flex flex-col"
                >
                  <div className=" h-[2.5rem] flex text-[1.2rem] font-bold   border-[1px] border-solid justify-center items-center">
                    <span>{gradePart.name}</span>
                  </div>
                  <div
                    className="grid   items-center justify-center w-full"
                    style={{
                      gridTemplateColumns: `repeat(${gradePart.testid?.length}, 1fr)`,
                    }}
                  >
                    {gradePart.testid.map((test, i) => (
                      <div key={i}>
                        <div className=" flex   border-[1px]  h-[2.5rem] justify-center items-center  border-solid   ">
                          {test.isOnline && (
                            <Globe size={18} className="text-primary" />
                          )}
                          {!test.isOnline && (
                            <PenLineIcon size={18} className="text-primary" />
                          )}
                          <span className="ml-1">{test.name}</span>
                        </div>
                        <div className=" flex  border-[1px] justify-center items-center   h-[2.5rem]">
                          <span>
                            {test.doTest[0].point ? (
                              test.doTest[0].point
                            ) : (
                              <Badge variant="secondary">UNGRADED</Badge>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="   border-[2px]  w-ful min-w-[75px] flex justify-center  items-center">
                <div>
                  <div className=" flex justify-center    font-semibold text-center">
                    Final <br /> grade
                  </div>

                  <div className=" flex justify-center  font-semibold">
                    <span>{finalGrade.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </>
          </div>
        </div>
      </div>
      <Separator className="w-[70vw] mt-8"></Separator>
      <h1 className=" text-4xl text-center mt-5 font-bold">
        Online Assignments
      </h1>
      <div className=" mt-10 flex justify-center items-center w-full">
        <div
          className=" h-fit gap-5  w-[60vw] "
          style={{
            display: "grid",
            gap: "2rem",
            gridTemplateColumns: "repeat(auto-fill,minmax(340px, 1fr)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {onlineTests.map((test, i) => (
            <DoOnlineTestComponent key={i} test={test}></DoOnlineTestComponent>
          ))}
        </div>
      </div>
    </div>
  );
}
type cusTest = Test & { gradePartName: string };

function DoOnlineTestComponent({ test }: { test: cusTest }) {
  const isDual = isOverTime(test.deadLine);
  const doTest = test.doTest[0];
  return (
    // </div>
    <SubmitTest test={test}>
      <div
        className=" flex justify-center items-center w-full h-full"
        id={doTest.testId + "-" + doTest.studentId}
      >
        <Card className="w-[340px] hover:scale-[1.05]  transition-transform self-center relative">
          <CardHeader>
            <CardTitle>
              <span className=" text-xl font-bold">
                {test.gradePartName} : {test.name}
              </span>
            </CardTitle>
            <CardDescription>
              <div className=" flex gap-1 mt-1  items-center">
                {test.isOnline ? (
                  <Badge
                    variant="outline"
                    className=" flex gap-1 mt-1  items-center"
                  >
                    <Globe size={18}></Globe>
                    <span>Online Test</span>
                  </Badge>
                ) : (
                  <>
                    <PenLineIcon size={18}></PenLineIcon>
                    <span>Offline Test</span>
                  </>
                )}
              </div>
              <div className=" flex gap-1 mt-1  items-center">
                {test.isOnline && (
                  <Badge
                    variant="outline"
                    className=" flex gap-1 mt-1  items-center"
                  >
                    <CalendarDays size={18}></CalendarDays>
                    <span>{dayjs(test.deadLine).format("DD/MM/YY")}</span>
                  </Badge>
                )}
              </div>
              <div className=" absolute top-0 right-0 ">
                {!doTest.pendingGradeReview ? (
                  <Badge
                    className=" rounded-br-none font-bold  "
                    variant={
                      test.isFinalize
                        ? "default"
                        : isDual
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {test.isFinalize
                      ? "GRADED"
                      : !isDual
                      ? "DOING"
                      : "UNGRADED"}
                  </Badge>
                ) : (
                  <Badge className=" bg-orange-400 hover:bg-orange-300 rounded-br-none font-bold ">
                    In Review
                  </Badge>
                )}
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </SubmitTest>
  );
}

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ReactNode, useRef, useState } from "react";
import { isOverTime } from "@/ultis/classFunctions";
import { Label } from "@/components/ui/label";
import { FileComponent } from "./FileComponent";
import Dropzone from "@/ultis/DropZone";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import api from "@/axios/axios";

const Schema = z.object({
  files: z.array(z.instanceof(File)).optional(),
});

type SchemaType = z.infer<typeof Schema>;

function SubmitTest({
  children,
  test,
}: {
  children: ReactNode;
  test: cusTest;
}) {
  const isDual = isOverTime(test.deadLine);
  const classId = useGetClassId();
  const userId = useGetUserInfo().userInfo?.userId;
  const doTest = test.doTest[0];
  const form = useForm<SchemaType>({
    resolver: zodResolver(Schema),
  });

  const queryClient = useQueryClient();
  /////////////////////////////////////////////////////////////////////////////
  const requestGradeReview = async () => {
    if (!classId) return;
    await api.post("/user/class/requestGradeReview", {
      classId,
      testId: test.id,
    });
    form.reset();
    return;
  };
  const { mutate: mutateRequest, isPending: isPendingRequest } = useMutation({
    mutationFn: requestGradeReview,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`Student-Grade-${userId}-${classId}`],
      });
    },
    onError: (error) => {
      const err = error as MyError;
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${err.message}`,
      });
    },
  });
  ///////////////////////////////////////////////////////////////////////////////////
  const submitTest = async (submitData: SchemaType) => {
    const formData = new FormData();
    if (!submitData.files || !classId) return;

    formData.append("classId", classId);
    formData.append("testId", test.id);
    submitData.files.forEach((file) => formData.append("files", file));

    await api.post("/user/class/submitTest", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    form.reset();
    setOpen(false);
    return;
  };
  const { mutate, isPending } = useMutation({
    mutationFn: submitTest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`Student-Grade-${userId}-${classId}`],
      });
    },
    onError: (error) => {
      const err = error as MyError;
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${err.message}`,
      });
    },
  });
  //////////////////////////////////////////////////////////////////////////////
  const onPostComment = async () => {
    if (!commentRef.current) return;
    await api.post("/user/class/postTestComment", {
      testName: test.name,
      testId: test.id,
      postId: test.content.receiver[0].id,
      content: commentRef.current.textContent,
      classId: classId,
    });
    commentRef.current.textContent = "";
  };
  const { mutate: mutatePostComment, isPending: isPendingPostComment } =
    useMutation({
      mutationFn: onPostComment,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [`Student-Grade-${userId}-${classId}`],
        });
      },
      onError: (error) => {
        const err = error as MyError;
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `${err.message}`,
        });
      },
    });

  const [open, setOpen] = useState(false);
  const commentRef = useRef<HTMLSpanElement>(null);
  const sortedComment = test.content.receiver[0].comments.sort(sortByTime);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[1100px]">
        <DialogHeader>
          <DialogTitle>
            {test.gradePartName} : {test.name}
          </DialogTitle>
        </DialogHeader>

        <div
          className={`grid ${"grid-cols-[3fr_1fr_3fr]"} gap-4 items-center  `}
        >
          <div className=" flex flex-col gap-2">
            <div className="flex gap-2  items-center">
              <Label>Methods :</Label>

              <div className=" flex gap-1 mt-1  items-center">
                {test.isOnline ? (
                  <Badge
                    variant="outline"
                    className=" flex gap-1  items-center"
                  >
                    <Globe size={18}></Globe>
                    <span>Online Test</span>
                  </Badge>
                ) : (
                  <>
                    <PenLineIcon size={18}></PenLineIcon>
                    <span>Offline Test</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-2  items-center">
              <Label>Deadline :</Label>

              <div className=" flex gap-1 items-center">
                {test.isOnline && (
                  <Badge
                    variant={isDual ? "destructive" : "outline"}
                    className=" flex gap-1 mt-1  items-center"
                  >
                    <CalendarDays size={18}></CalendarDays>
                    <span>
                      {dayjs(test.deadLine).format("hh:mm A  DD/MM/YYYY")}
                    </span>
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <Label>Description :</Label>
              <div className="my-content-tiptap mt-1 border-solid border-2 p-5 rounded-md min-h-[18rem]">
                {parse(test.content.content)}
              </div>
            </div>
            <div className="">
              <Label>Attached files: </Label>
              <div className=" flex flex-wrap mt-1 gap-2 border-solid border-2 h-fit p-2 rounded-md ">
                {test.content.fileKeys.length > 0 ? (
                  test.content.fileKeys.map((key, i) => (
                    <FileComponent fileKey={key} key={i} isTestFile={true} />
                  ))
                ) : (
                  <span className="text-sm font-bold w-full text-center">
                    Empty{" "}
                  </span>
                )}
              </div>
            </div>
          </div>

          {!isDual && !test.isFinalize && (
            <div className=" h-[100%] flex flex-col justify-start gap-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) => mutate(data))}
                  className="space-y-3  flex flex-col    h-[300px]"
                  id={"submitTest " + test.id}
                >
                  <span className="text-xl font-bold">
                    Submit your files here :
                  </span>
                  <FormField
                    control={form.control}
                    name="files"
                    render={() => (
                      <>
                        <Dropzone multiple={true} form={form}></Dropzone>
                      </>
                    )}
                  />
                </form>
              </Form>
              <div>
                <Label>Last submission</Label>
                <div className="flex flex-wrap mt-1 gap-2 border-solid border-2 h-fit p-2 rounded-md w-full ">
                  {doTest.fileKeys.length > 0 ? (
                    doTest.fileKeys.map((key, i) => (
                      <FileComponent fileKey={key} key={i} isTestFile={false} />
                    ))
                  ) : (
                    <span className="text-sm font-bold w-full text-center">
                      Empty
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {isDual && !test.isFinalize && (
            <div className="flex flex-col justify-center items-center">
              <span className="text-4xl font-extrabold  text-center mb-5">
                ON GRADING
              </span>
              <span className="text-md font-bold">Your submissions</span>
              <div className=" flex flex-wrap mt-1 gap-2 border-solid border-2 h-fit p-2 rounded-md w-full ">
                {doTest.fileKeys.length > 0 ? (
                  doTest.fileKeys.map((key, i) => (
                    <FileComponent fileKey={key} key={i} isTestFile={false} />
                  ))
                ) : (
                  <span className="text-sm font-bold w-full text-center">
                    Empty
                  </span>
                )}
              </div>
            </div>
          )}

          {test.isFinalize && (
            <div className="flex flex-col items-center gap-3   rounded-md ">
              <span className="font-extrabold text-4xl text-center">
                {doTest.pendingGradeReview ? "IN REVIEW" : "GRADED"}
              </span>
              <div>
                <span
                  className={`${
                    doTest.pendingGradeReview
                      ? " text-amber-400"
                      : "text-primary"
                  }  font-extrabold text-5xl `}
                >
                  {doTest.point}
                </span>
              </div>
              <div className=" w-full flex flex-col justify-center items-center">
                <span className="text-md font-bold">Your submissions</span>
                <div className=" flex flex-wrap mt-1 gap-2 border-solid border-2 h-fit p-2 rounded-md w-full ">
                  {doTest.fileKeys.length > 0 ? (
                    doTest.fileKeys.map((key, i) => (
                      <FileComponent fileKey={key} key={i} isTestFile={false} />
                    ))
                  ) : (
                    <span className="text-sm font-bold w-full text-center">
                      Empty
                    </span>
                  )}
                </div>
              </div>
              {!doTest.pendingGradeReview && (
                <Button
                  disabled={isPendingRequest}
                  onClick={() => {
                    mutateRequest();
                  }}
                >
                  {!isPendingRequest ? "Request Grade Review" : <Spinner />}
                </Button>
              )}
            </div>
          )}

          <div className=" h-full flex-col flex gap-3 ">
            <div className="w-full  min-h-[27rem] max-h-[27rem]  flex flex-col scrollbar-none gap-3  p-5  border-solid border-2 overflow-auto rounded-lg">
              {sortedComment.map((el, i) => (
                <Comment key={i} commentData={el} />
              ))}
            </div>
            <div className=" w-full  relative ">
              <span
                ref={commentRef}
                contentEditable={true}
                role="textbox"
                className="   border-solid border-2 p-[0.5rem] px-[1.5rem] rounded-lg block overflow-hidden w-full  "
              />

              <button
                onClick={() => {
                  mutatePostComment();
                }}
                disabled={isPendingPostComment}
                className=" absolute flex justify-center items-center right-2 top-[10px]  bottom-[11px]  cursor-pointer   rounded-full p-2 "
              >
                {isPendingPostComment ? (
                  <Spinner></Spinner>
                ) : (
                  <SendHorizontal></SendHorizontal>
                )}
              </button>
            </div>
          </div>
        </div>

        <DialogFooter>
          {!test.isFinalize && !isDual && (
            <Button type="submit" form={"submitTest " + test.id}>
              {!isPending ? (
                <>
                  <UploadCloudIcon size={18}></UploadCloudIcon>
                  <span className=" ml-2">Submit</span>
                </>
              ) : (
                <Spinner />
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
