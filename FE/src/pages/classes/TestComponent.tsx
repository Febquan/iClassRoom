import {
  AlertCircle,
  CalendarIcon,
  CheckCheckIcon,
  FileCheck,
  FileMinus,
  GripVertical,
  PenBoxIcon,
  SendHorizontal,
} from "lucide-react";
import {
  Dispatch,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DoTest,
  FileTestPointUpload,
  GradePart,
  MyError,
  Test,
} from "@/ultis/appType";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Row } from "./MyTableAtom";
import {
  createTemplate,
  orderDoTest,
  sortByTime,
} from "@/ultis/classFunctions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Comment from "./Comment";
export function TestComponent({
  id,
  test,
  studentIdOrder,
  className,
  isActive,
  isOverlay,
  gradingMode,
  checkValidScaleTest,
  setGradePartsSortable,
  findContainerGradePart,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  id: string;
  test: Test;
  isActive?: boolean;
  gradingMode: boolean;
  studentIdOrder: string[] | undefined;
  isOverlay?: boolean;
  checkValidScaleTest: boolean;
  setGradePartsSortable?: Dispatch<SetStateAction<GradePart[] | undefined>>;
  findContainerGradePart?: (id: UniqueIdentifier) => string | undefined;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: id,
      transition: {
        duration: 250, // milliseconds
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      },
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  // const isPublic = test.doTest.reduce(
  //   (accumulator, currentValue) => accumulator && currentValue.point != null,
  //   true
  // );
  return (
    <div
      className={`min-w-[230px] relative ${
        isActive && "opacity-30"
      } ${className}  ${isOverlay ? "" : "mt-[-2.5rem]"} 
      
      `}
      onClick={() => {}}
      style={style}
      ref={setNodeRef}
    >
      {gradingMode && (
        <>
          <span {...listeners} className={` absolute right-1  top-[10px]  `}>
            <GripVertical size={18}></GripVertical>
          </span>
        </>
      )}
      <div
        {...props}
        {...attributes}
        className={`h-[2.5rem]   ${
          isOverlay ? "" : "border-l-[1px]  border-r-[1px] "
        }   w-full  grid  items-center justify-center border-solid  border-t-[1px] border-b-[1px]  
        ${
          gradingMode &&
          !checkValidScaleTest &&
          "border-solid border-b-[6px] border-destructive  "
        }
        `}
      >
        <div className="flex gap-1 justify-center items-center">
          {gradingMode && (
            <TestModal
              test={test}
              setGradePartsSortable={setGradePartsSortable}
              findContainerGradePart={findContainerGradePart}
            >
              <span className=" flex gap-2 justify-center items-center">
                {gradingMode && test.isFinalize && (
                  <span className="bg-primary rounded-full p-[2px] w-5 h-5 flex  justify-center items-center">
                    <CheckCheckIcon className="text-primary-foreground" />
                  </span>
                )}
                {gradingMode &&
                  test.isOnline &&
                  test.deadLine &&
                  (new Date(test.deadLine) > new Date() ? (
                    <CalendarClockIcon
                      size={18}
                      className=" text-secondary-foreground"
                    />
                  ) : (
                    <CalendarClockIcon size={18} className=" text-primary " />
                  ))}
                {test.name} {gradingMode && <span> | {test.scale} </span>}
              </span>
            </TestModal>
          )}
          {!gradingMode && <span>{test.name}</span>}
        </div>
      </div>
      <div>
        {orderDoTest(test.doTest, studentIdOrder).map((el, k) => (
          <Row
            className={` text-center h-[4rem] ${
              el.pendingGradeReview &&
              gradingMode &&
              "border-solid border-[2px] border-amber-500 "
            }`}
            key={`${el?.testId} ${k}`}
          >
            <div>
              {!gradingMode && el?.point && (
                <Badge variant="secondary" className=" text-sm">
                  <span>GRADED : {el.point} </span>
                </Badge>
              )}
              {gradingMode && el?.point && (
                <GradeTestModal
                  name={test.name}
                  doTest={el}
                  test={test}
                  setGradePartsSortable={setGradePartsSortable}
                  findContainerGradePart={findContainerGradePart}
                  testId={test.id}
                  isPublic={test.isFinalize}
                  isOnline={test.isOnline}
                >
                  <Button
                    id={el.testId + "-" + el.studentId}
                    variant="secondary"
                    className="h-5 p-2 py-3  "
                  >
                    {el.pendingGradeReview ? (
                      <AlertCircle
                        size={12}
                        className=" text-amber-500"
                      ></AlertCircle>
                    ) : (
                      <PenBoxIcon size={12} className=" text-primary" />
                    )}

                    <span className="ml-1">
                      GRADED: {<span> {el?.point}</span>}{" "}
                    </span>
                  </Button>
                </GradeTestModal>
              )}
              {!el?.point && (
                <>
                  {gradingMode && (
                    <GradeTestModal
                      name={test.name}
                      doTest={el}
                      setGradePartsSortable={setGradePartsSortable}
                      findContainerGradePart={findContainerGradePart}
                      testId={test.id}
                      isPublic={test.isFinalize}
                      isOnline={test.isOnline}
                      test={test}
                    >
                      <Button
                        id={el.testId + "-" + el.studentId}
                        variant="outline"
                        className="h-5 p-2 py-3  "
                      >
                        <>
                          {el.fileKeys.length > 0 ? (
                            <FileCheck size={16} className="text-primary" />
                          ) : (
                            <FileMinus
                              size={16}
                              className="text-secondary-foreground"
                            />
                          )}
                          <span className="ml-1">UNGRADED</span>
                        </>
                      </Button>
                    </GradeTestModal>
                  )}
                  {!gradingMode && (
                    <Badge variant="outline">
                      <span>UNGRADED </span>
                    </Badge>
                  )}
                </>
              )}
            </div>
          </Row>
        ))}
      </div>
    </div>
  );
}

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useGetClassExtraInfo,
  useGetClassId,
  useGetUserPublicInfo,
  useUserClassClassify,
} from "../customhook/classCustomHooks";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileComponent } from "./FileComponent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarClockIcon } from "lucide-react";

import TextEditor from "./TextEditor";
import Dropzone from "@/ultis/DropZone";
import { TimePicker } from "@/components/ui/time-picker";
import api from "@/axios/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import Spinner from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import * as XLSX from "xlsx";
import FormError from "./FormError";
const Schema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name cannot be empty" })
      .max(30, { message: " Name is too long" }),
    scale: z.coerce.number(),
    isFinalize: z.boolean(),
    isOnline: z.boolean(),
    deadLine: z.date().optional(),
    content: z
      .string()
      .max(2000, { message: "Your description is too long" })
      .optional(),
    time: z.date().optional(),
    files: z.array(z.instanceof(File)).optional(),
  })
  .refine(
    (data) => {
      return data.scale <= 1 && data.scale >= 0;
    },
    {
      message: "Grade scale is not valid  ",
      path: ["scale"],
    }
  );
type SchemaType = z.infer<typeof Schema>;

const SchemaUploadPoint = z.object({
  files: z.array(z.instanceof(File)).optional(),
});
type SchemaUploadPointType = z.infer<typeof SchemaUploadPoint>;

function TestModal({
  children,
  test,
  setGradePartsSortable,
  findContainerGradePart,
}: {
  children: ReactNode;
  test: Test;
  setGradePartsSortable?: Dispatch<SetStateAction<GradePart[] | undefined>>;
  findContainerGradePart?: (id: UniqueIdentifier) => string | undefined;
}) {
  const form = useForm<SchemaType>({
    resolver: zodResolver(Schema),
  });
  const formUploadTestPoint = useForm<SchemaUploadPointType>({
    resolver: zodResolver(SchemaUploadPoint),
  });
  const extraInfo = useGetClassExtraInfo();
  const { students } = useUserClassClassify();
  const isOnline = form.watch("isOnline");
  const uploadTestFile = formUploadTestPoint.watch("files");

  const onChangeInfo = (formData: SchemaType) => {
    if (!setGradePartsSortable) return;
    setGradePartsSortable((oldValue) => {
      if (!oldValue || !findContainerGradePart) return oldValue;
      const newState: GradePart[] = window.structuredClone(oldValue);
      const containerIndex = oldValue.findIndex(
        (el) => el.id === findContainerGradePart(test.id)
      );
      const testIndex = oldValue[containerIndex].testid.findIndex(
        (el) => el.id === test.id
      );

      newState[containerIndex].testid[testIndex].name = formData.name;
      newState[containerIndex].testid[testIndex].scale = formData.scale;
      newState[containerIndex].testid[testIndex].isFinalize =
        formData.isFinalize;
      newState[containerIndex].testid[testIndex].isOnline = formData.isOnline;
      newState[containerIndex].testid[testIndex].deadLine = formData.deadLine;
      if (formData.content) {
        newState[containerIndex].testid[testIndex].content.content =
          formData.content;
      }
      newState[containerIndex].testid[testIndex].content.files = formData.files;
      // return newState;
      // handle upload file
      if (!uploadPoint || !extraInfo || !students) return newState;
      const mapping: Record<string, string> = {};
      students.forEach(
        (student) => (mapping[student.organizeId as string] = student.userId)
      );

      for (const studentPoint of uploadPoint) {
        const index = newState[containerIndex].testid[
          testIndex
        ].doTest.findIndex(
          (dt) => dt.studentId == mapping[String(studentPoint["Student Id"])]
        );
        if (index == -1) {
          continue;
        }
        newState[containerIndex].testid[testIndex].doTest[index].point =
          studentPoint.Point;
      }

      return newState;
    });

    form.reset();
    setOpen(false);
  };
  const [open, setOpen] = useState(false);

  useEffect(() => {
    form.reset();
    form.setValue("name", test.name);
    form.setValue("scale", test.scale);
    form.setValue("isFinalize", test.isFinalize);
    form.setValue("isOnline", test.isOnline);
    if (test.deadLine) {
      form.setValue("deadLine", new Date(test.deadLine));
    }
    if (test.content) {
      form.setValue("content", test.content.content);
    }
    if (test.content.files) {
      form.setValue("files", test.content.files);
    }
  }, [
    form,
    test.name,
    test.scale,
    open,
    test.isFinalize,
    test.isOnline,
    test.deadLine,
    test.content,
  ]);
  //check file type
  const [isValidKeys, setIsValid] = useState<boolean>(true);
  const [uploadPoint, setUploadPoint] = useState<FileTestPointUpload[]>();

  useEffect(() => {
    //update point
    const reader = new FileReader();
    if (uploadTestFile?.length == 0 || !uploadTestFile) {
      return;
    }
    reader.readAsBinaryString(uploadTestFile[0]);
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData: FileTestPointUpload[] = XLSX.utils.sheet_to_json(sheet);
      const fields = Object.keys(parsedData[0]);
      setIsValid(fields.includes("Student Id") && fields.includes("Point"));
      setUploadPoint(parsedData);
      //  console.log(
      //    parsedData,
      //    "lsussussususu"
      //  );
    };
  }, [uploadPoint, uploadTestFile]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={` ${isOnline ? "sm:max-w-[925px]" : "sm:max-w-[425px]"} `}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onChangeInfo)}
            className={`space-y-3  grid ${
              isOnline ? "grid-cols-[3fr_2fr]" : ""
            } gap-5 items-center`}
            id={"changeTestInfo " + test.id}
          >
            <div className=" flex flex-col gap-4 items-center justify-center relative h-full">
              <div className=" flex  flex-col  gap-3 self-stretch ">
                {isOnline && (
                  <>
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <TextEditor
                              content={field.value}
                              onChange={field.onChange}
                            ></TextEditor>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="files"
                      render={() => (
                        <>
                          <FormLabel>Change or add files: </FormLabel>
                          <Dropzone multiple={true} form={form}></Dropzone>
                        </>
                      )}
                    />
                    <div>
                      <FormLabel>Existing files: </FormLabel>
                      <div className=" flex flex-wrap gap-2 border-solid border-2 h-fit p-2 rounded-md ">
                        {test.content.fileKeys.length > 0 ? (
                          test.content.fileKeys.map((key, i) => (
                            <FileComponent
                              fileKey={key}
                              key={i}
                              isTestFile={true}
                            />
                          ))
                        ) : (
                          <span>Empty </span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test scale</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step={0.05}
                        max={1}
                        min={0}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {isOnline && (
                <>
                  <FormField
                    control={form.control}
                    name="deadLine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deadline </FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2 mt-5 justify-center">
                            <span className=" ml-3 font-semibold text-[0.8rem]">
                              Before
                            </span>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(
                                        field.value,
                                        "hh:mm:ss aa dd/MM/yyyy"
                                      )
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="center"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  // disabled={{ before: new Date() }}
                                  initialFocus
                                />
                                <div className="p-3 border-t border-border">
                                  <TimePicker
                                    setDate={field.onChange}
                                    date={field.value}
                                  />
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}
              <div>
                <FormField
                  control={form.control}
                  name="isOnline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Online test: </FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2 mt-5 justify-center">
                          <Checkbox
                            id="checkBoxOnline"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />

                          <label
                            htmlFor="checkBoxOnline"
                            className="text-[1rem] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Is online test ?
                          </label>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFinalize"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2 mt-5 justify-center">
                          <Checkbox
                            id="checkBoxFinalize"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />

                          <label
                            htmlFor="checkBoxFinalize"
                            className="text-[1rem] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Public test result
                          </label>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-2">
                <div className=" flex justify-between items-center">
                  <Label>Upload students point by file: </Label>
                  <Button
                    type="button"
                    className=" right-2 top-[-45px] scale-[0.8]"
                    variant="ghost"
                    onClick={() => createTemplate(["Student Id", "Point"])}
                  >
                    Dowload Template
                  </Button>
                </div>
                <Form {...formUploadTestPoint}>
                  <form className="mt-2">
                    <FormField
                      control={formUploadTestPoint.control}
                      name="files"
                      render={() => (
                        <>
                          <Dropzone
                            multiple={false}
                            form={formUploadTestPoint}
                            accept={{
                              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                                [".xlsx"],
                              "application/vnd.ms-excel": [".xls"],
                            }}
                          ></Dropzone>
                          {!isValidKeys && (
                            <FormError>Invalid excel file structure</FormError>
                          )}

                          <FormDescription className=" mt-1">
                            Excel file must contain 2 fields "Student Id" and
                            "Point"
                          </FormDescription>
                        </>
                      )}
                    />
                  </form>
                </Form>
              </div>
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="submit"
            form={"changeTestInfo " + test.id}
            disabled={!isValidKeys}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const SchemaDoTest = z
  .object({
    point: z.coerce.number().optional(),
    isPendingReviewGrade: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.point != null) {
        return data.point <= 10 && data.point >= 0;
      }
    },
    {
      message: "Grade is not in valid range: 0-10",
      path: ["point"],
    }
  );
type SchemaDoTestType = z.infer<typeof SchemaDoTest>;

function GradeTestModal({
  children,
  doTest,
  name,
  setGradePartsSortable,
  findContainerGradePart,
  testId,
  isPublic,
  isOnline,
  test,
}: {
  name: string;
  test: Test;
  children: ReactNode;
  doTest: DoTest;
  isPublic?: boolean;
  setGradePartsSortable?: Dispatch<SetStateAction<GradePart[] | undefined>>;
  findContainerGradePart?: (id: UniqueIdentifier) => string | undefined;
  testId: string;
  isOnline: boolean;
}) {
  const form = useForm<SchemaDoTestType>({
    resolver: zodResolver(SchemaDoTest),
  });
  const studentInfo = useGetUserPublicInfo(doTest.studentId);

  const onChangeInfo = (formData: SchemaDoTestType) => {
    console.log(formData, setGradePartsSortable, "dotesttt");
    if (!setGradePartsSortable) return;
    setGradePartsSortable((oldValue) => {
      if (!oldValue || !findContainerGradePart) return oldValue;
      const newState: GradePart[] = window.structuredClone(oldValue);
      const containerIndex = oldValue.findIndex(
        (el) => el.id === findContainerGradePart(testId)
      );
      const testIndex = oldValue[containerIndex].testid.findIndex(
        (el) => el.id === testId
      );
      const doTestIndex = oldValue[containerIndex].testid[
        testIndex
      ].doTest.findIndex(
        (el) => el.testId === doTest.testId && el.studentId == doTest.studentId
      );

      newState[containerIndex].testid[testIndex].doTest[doTestIndex].point =
        formData.point ? formData.point : null;
      if (formData.isPendingReviewGrade !== undefined) {
        newState[containerIndex].testid[testIndex].doTest[
          doTestIndex
        ].pendingGradeReview = !formData.isPendingReviewGrade;
      }
      return newState;
    });
    form.reset();
    setOpen(false);
  };
  const [open, setOpen] = useState(false);
  ///////////////////////////////////////////////////////////////////
  const classId = useGetClassId();
  const queryClient = useQueryClient();
  const receiver = test.content.receiver.find(
    (el) => el.receiverId == doTest.studentId
  );
  const onPostComment = async () => {
    if (!receiver || !commentRef.current) return;
    await api.post("/user/class/postTestComment", {
      testName: test.name,
      testId: test.id,
      postId: receiver.id,
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
          queryKey: [`Class-Grade-${classId}`],
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
  const commentRef = useRef<HTMLSpanElement>(null);
  const sortedComment = receiver?.comments?.sort(sortByTime);
  useEffect(() => {
    form.reset();
    form.setValue("point", doTest.point ? doTest.point : undefined);
  }, [form, open, doTest.point]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={`${isOnline ? "sm:min-w-[800px]" : ""} `}>
        <DialogHeader>
          <DialogTitle className=" text-3xl">Test: {name} </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onChangeInfo)}
              className="space-y-3"
              id={"changeTestInfo " + doTest.testId + doTest.studentId}
            >
              <div
                className={`grid ${isOnline && "grid-cols-[3fr_2fr]"}
                gap-4 items-center  `}
              >
                <div className="flex flex-col gap-3">
                  {isPublic && (
                    <div className="text-center ">
                      {doTest.pendingGradeReview ? (
                        <div className=" flex h-6 justify-between items-center px-[20px]">
                          <Badge className="font-bold">
                            {studentInfo?.student.userName} requested a grade
                            review
                          </Badge>

                          <FormField
                            control={form.control}
                            name="isPendingReviewGrade"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="flex items-center space-x-2  justify-center">
                                    <Checkbox
                                      id="checkBoxFinalize"
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />

                                    <label
                                      htmlFor="checkBoxFinalize"
                                      className="text-[1rem] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      Done Review
                                    </label>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      ) : (
                        isOnline && (
                          <Badge variant="secondary" className="font-bold">
                            No any pending grade review
                          </Badge>
                        )
                      )}
                    </div>
                  )}

                  {isOnline && (
                    <div className=" h-full flex-col flex gap-3">
                      <div className="w-full min-h-[20rem] max-h-[20rem]  flex flex-col scrollbar-none gap-3  p-5 scrollbar-thin border-solid border-2  overflow-auto rounded-lg">
                        {sortedComment?.map((el, i) => (
                          <Comment
                            key={i}
                            commentData={el}
                            isTestComment={true}
                          />
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
                          type="button"
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
                  )}
                </div>
                <div className="flex h-fit   flex-col gap-3 justify-center items-center">
                  <div className=" bg-secondary py-4  w-full  p-2 rounded-lg flex flex-col gap-1 justify-center item-center">
                    <span className="font-semibold text-center text-[1.8rem]">
                      {studentInfo?.organizeId}
                    </span>
                    <div className="flex    gap-1  justify-center items-center ">
                      <Avatar className="h-[35px] w-[35px]">
                        <AvatarImage
                          src={studentInfo?.student.avatar}
                          alt="@shadcn"
                        />
                        <AvatarFallback>
                          {studentInfo?.student.userName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-[1.1rem] font-medium leading-non">
                          {studentInfo?.student.userName}
                        </span>
                      </div>
                    </div>
                  </div>
                  {isOnline && (
                    <div className="   overflow-auto  scrollbar-thin  w-full rounded-lg border-dashed border-2 flex flex-col gap-2  p-4">
                      <div className="  min-h-[100px]  flex justify-center items-center flex-col gap-1">
                        {doTest.fileKeys.length > 0 ? (
                          doTest.fileKeys.map((key, i) => (
                            <FileComponent
                              fileKey={key}
                              key={i}
                              isTestFile={false}
                            />
                          ))
                        ) : (
                          <span className="text-sm font-bold w-full text-center">
                            No any submission
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <FormField
                    control={form.control}
                    name="point"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex  gap-2 items-center  justify-center">
                          <FormLabel className="text-lg">Test point</FormLabel>
                          <FormControl>
                            <Input {...field} className="w-[5rem] " />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            form={"changeTestInfo " + doTest.testId + doTest.studentId}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
