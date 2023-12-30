import Spinner from "@/components/ui/spinner";
import { useGetStudentGrade } from "../customhook/classCustomHooks";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Globe, PenLineIcon } from "lucide-react";
import { Test } from "@/ultis/appType";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dayjs from "@/ultis/myDayjs";

export default function StudentClassGrade() {
  const studentGrade = useGetStudentGrade();
  console.log(studentGrade);
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
              {studentGrade.map((gradePart) => (
                <div className=" border-solid  min-w-[280px]  border-[2px] flex-1 justify-center flex flex-col">
                  <div className=" h-[2.5rem] flex text-[1.2rem] font-bold   border-[1px] border-solid justify-center items-center">
                    <span>{gradePart.name}</span>
                  </div>
                  <div
                    className="grid   items-center justify-center w-full"
                    style={{
                      gridTemplateColumns: `repeat(${gradePart.testid?.length}, 1fr)`,
                    }}
                  >
                    {gradePart.testid.map((test) => (
                      <div>
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
      <h1 className=" text-4xl text-center mt-5 font-bold">Assignments</h1>
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
            <DoTestComponent key={i} test={test}></DoTestComponent>
          ))}
        </div>
      </div>
    </div>
  );
}

function DoTestComponent({ test }: { test: Test & { gradePartName: string } }) {
  const isDual = isOverTime(test.deadLine);
  console.log(isDual, "-22");
  return (
    // </div>
    <SubmitTest>
      <div className=" flex justify-center items-center w-full h-full">
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
                <Badge
                  className=" rounded-br-none font-bold"
                  variant={
                    test.isFinalize
                      ? "default"
                      : isDual
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {test.isFinalize ? "GRADED" : !isDual ? "DOING" : "UNGRADED"}
                </Badge>
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";
import { isOverTime } from "@/ultis/classFunctions";

function SubmitTest({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
