import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  useGetAllStudentInClass,
  useGetClassGrade,
  useGetClassId,
  useGetRegisterStudentId,
  useNewLink,
} from "../customhook/classCustomHooks";
import { useEffect, useState } from "react";
import { GradePart, MyError, Test } from "@/ultis/appType";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragOverEvent,
  UniqueIdentifier,
  useDroppable,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { TestComponent } from "./TestComponent";
import {
  checkEqual,
  createExcel,
  createtempGradePart,
  isSameContextObject,
  orderDoTest,
} from "@/ultis/classFunctions";
import { GradePartComponent } from "./GradePartComponent";
import { Col, Row } from "./MyTableAtom";

import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Save, PencilLine, Trash2, Plus } from "lucide-react";
import { SearchBar } from "@/components/ui/search";
import api from "@/axios/axios";
import { toast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import SpinPage from "@/components/ui/spin-page";

export default function TeacherClassGrading() {
  const [searchValue, setSearchValue] = useState<string>("");
  const registeredStudent: string[] | undefined = useGetRegisterStudentId();
  const [deleteFiles, setDeleteFiles] = useState<string[]>([]);
  const students = useGetAllStudentInClass()?.filter(
    (el) =>
      (el.student.userName.toLowerCase().includes(searchValue.toLowerCase()) ||
        el.organizeId.includes(searchValue)) &&
      (registeredStudent ? registeredStudent?.includes(el.organizeId) : true)
  );
  const gradeParts = useGetClassGrade();
  // const filterRegisteredStudent=
  const [activeGradePart, setActiveGradePart] = useState<GradePart>();
  const [activeTest, setActiveTest] = useState<Test>();
  const { elementId } = useParams();
  let a = false;
  if (elementId) {
    a = true;
  }

  const [gradingMode, setGradingMode] = useState<boolean>(a);
  const studentIdOrder = students?.map((student) => student.userId);

  const [gradePartsSortable, setGradePartsSortable] = useState<
    GradePart[] | undefined
  >(gradeParts);

  useNewLink(gradePartsSortable);
  const isNoChange = isSameContextObject(gradeParts, gradePartsSortable);
  const gradePartIds = gradePartsSortable?.map((el) => el.id);
  const testIds = gradePartsSortable
    ?.map((el) => el.testid.map((test) => test.id))
    .flat();
  function checkIsTestId(id: UniqueIdentifier) {
    return testIds?.includes(id as string);
  }
  function checkIsGradePartId(id: UniqueIdentifier) {
    return gradePartIds?.includes(id as string);
  }

  useEffect(() => {
    setGradePartsSortable(gradeParts);
  }, [gradeParts]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [isdragging, setIsdragging] = useState<boolean>(false);

  const classId = useGetClassId();
  function handleDragStart(event: DragStartEvent) {
    setIsdragging(true);
    const { active } = event;
    if (!gradePartsSortable) return;
    const activeGradePart = gradePartsSortable?.find(
      (el) => el.id === active.id
    );
    let activeTest = undefined;
    for (const gradepart of gradePartsSortable) {
      activeTest = gradepart.testid?.find((el) => el.id == active.id);
      if (activeTest) break;
    }
    if (activeGradePart) {
      setActiveGradePart(activeGradePart);
    }
    if (activeTest) {
      setActiveTest(activeTest);
    }
  }
  function findContainerGradePart(id: UniqueIdentifier) {
    if (!gradePartsSortable) return;

    return gradePartsSortable.find((el) =>
      el.testid.map((el) => el.id).includes(id as string)
    )?.id;
  }
  function handleDragOver({ active, over }: DragOverEvent) {
    //handle test to container
    if (
      active.id !== over?.id &&
      checkIsTestId(active.id) &&
      over?.id &&
      checkIsGradePartId(over.id) &&
      findContainerGradePart(active.id) !== over.id
    ) {
      console.log("test to coineter");
      setGradePartsSortable((oldGradePartState: GradePart[] | undefined) => {
        if (!oldGradePartState) return;
        const newContainerIndex = oldGradePartState.findIndex(
          (el) => el.id === over.id
        );
        const oldContainerIndex = oldGradePartState.findIndex(
          (el) => el.id === findContainerGradePart(active.id)
        );
        const newContainerItemIndex =
          oldGradePartState[newContainerIndex].testid.length;
        const oldContainerItemIndex = oldGradePartState[
          oldContainerIndex
        ].testid.findIndex((test) => test.id == active.id);
        const oldContainer = [...oldGradePartState[oldContainerIndex].testid];
        const newContainer = [...oldGradePartState[newContainerIndex].testid];

        const movedItem =
          oldGradePartState[oldContainerIndex].testid[oldContainerItemIndex];

        const oldContainerNewState = oldContainer.filter(
          (el) => el.id !== active.id
        );
        const newContainerNewState = [
          ...newContainer.slice(0, newContainerItemIndex + 1),
          movedItem,
          ...newContainer.slice(newContainerItemIndex + 1),
        ];

        oldGradePartState[oldContainerIndex].testid = oldContainerNewState;
        oldGradePartState[newContainerIndex].testid = newContainerNewState;

        return [...oldGradePartState];
      });
      return;
    }

    //handle test to test

    if (
      active.id !== over?.id &&
      checkIsTestId(active.id) &&
      over?.id &&
      checkIsTestId(over.id) &&
      findContainerGradePart(active.id) !== findContainerGradePart(over.id)
    ) {
      setGradePartsSortable((oldGradePartState: GradePart[] | undefined) => {
        if (!oldGradePartState) return;
        const newState: GradePart[] = window.structuredClone(oldGradePartState);
        const newContainerIndex = newState.findIndex(
          (el) => el.id === findContainerGradePart(over.id)
        );
        const oldContainerIndex = newState.findIndex(
          (el) => el.id === findContainerGradePart(active.id)
        );
        const newContainerItemIndex = newState[
          newContainerIndex
        ].testid.findIndex((test) => test.id == over.id);
        const oldContainerItemIndex = newState[
          oldContainerIndex
        ].testid.findIndex((test) => test.id == active.id);
        const oldContainer = [...newState[oldContainerIndex].testid];
        const newContainer = [...newState[newContainerIndex].testid];

        const movedItem =
          newState[oldContainerIndex].testid[oldContainerItemIndex];
        movedItem.gradePartId = newState[newContainerIndex].id;
        const oldContainerNewState = oldContainer.filter(
          (el) => el.id !== active.id
        );
        const newContainerNewState = [
          ...newContainer.slice(0, newContainerItemIndex + 1),
          movedItem,
          ...newContainer.slice(newContainerItemIndex + 1),
        ];

        newState[oldContainerIndex].testid = oldContainerNewState;
        newState[newContainerIndex].testid = newContainerNewState;

        return newState;
      });
      return;
    }
  }
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    // containter sort
    if (
      active.id !== over?.id &&
      checkIsGradePartId(active.id) &&
      over?.id &&
      checkIsGradePartId(over.id)
    ) {
      setGradePartsSortable((oldGradePartState: GradePart[] | undefined) => {
        if (!oldGradePartState) return;

        const arrayOldGradePartState = oldGradePartState.map((el) => el.id);
        const oldIndex = arrayOldGradePartState?.indexOf(active.id as string);
        const newIndex = arrayOldGradePartState?.indexOf(over?.id as string);
        const res = arrayMove(oldGradePartState!, oldIndex!, newIndex!);

        return res.map((data, i) => ({ ...data, sort: i }));
      });
    }
    // item sort
    if (
      active.id !== over?.id &&
      checkIsTestId(active.id) &&
      over?.id &&
      checkIsTestId(over.id) &&
      findContainerGradePart(active.id) === findContainerGradePart(over.id)
    ) {
      setGradePartsSortable((oldGradePartState: GradePart[] | undefined) => {
        if (!oldGradePartState) return;
        const newState: GradePart[] = window.structuredClone(oldGradePartState);

        const containerIndex = newState.findIndex(
          (el) => el.id === findContainerGradePart(active.id)
        );
        const tests = [...newState[containerIndex].testid];
        const testsId = tests.map((el) => el.id);
        const oldIndex = testsId?.indexOf(active.id as string);
        const newIndex = testsId?.indexOf(over?.id as string);
        const newTestState = arrayMove(tests!, oldIndex!, newIndex!).map(
          (test, i) => ({ ...test, sort: i })
        );

        newState[containerIndex].testid = newTestState;
        return newState;
      });
    }

    // Delete Item
    if (active.id !== over?.id && over?.id && over.id === "trashCan") {
      setGradePartsSortable((oldGradePartState: GradePart[] | undefined) => {
        if (!oldGradePartState) return;
        let newState: GradePart[] = window.structuredClone(oldGradePartState);

        if (checkIsTestId(active.id)) {
          const containerIndex = newState.findIndex(
            (el) => el.id === findContainerGradePart(active.id)
          );
          const newTestState = [
            ...newState[containerIndex].testid.filter(
              (test) => test.id != active.id
            ),
          ];
          const deletedFile = newState[containerIndex].testid.find(
            (test) => test.id == active.id
          )?.content.fileKeys;
          if (deletedFile) {
            setDeleteFiles((prev) => [...prev, ...deletedFile]);
          }
          newState[containerIndex].testid = newTestState;
          return [...newState];
        }
        if (checkIsGradePartId(active.id)) {
          const newTestState = newState.filter(
            (gradePart) => gradePart.id != active.id
          );
          const deletedFile = newState
            .find((gp) => gp.id == active.id)
            ?.testid.map((test) => test.content.fileKeys)
            .flat();
          if (deletedFile) {
            setDeleteFiles((prev) => [...prev, ...deletedFile]);
          }
          newState = newTestState;
          return newState;
        }
      });
    }

    setActiveGradePart(undefined);
    setActiveTest(undefined);
    setIsdragging(false);
  }

  // calculate final point

  console.log(gradePartsSortable, "====================", deleteFiles);

  const checkValidGradePartScale = checkEqual(
    1,
    gradePartsSortable?.reduce(
      (accumulator, currentValue) => accumulator + currentValue.scale,
      0
    )
  );

  const checkAllTestScaleGradePart = gradePartsSortable
    ?.map((el) => el.testid.map((el) => el.scale))
    .reduce(
      (accumulator, currentValue) =>
        accumulator &&
        checkEqual(
          1,
          currentValue?.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
          )
        ),
      true
    );
  const validScale = checkAllTestScaleGradePart && checkValidGradePartScale;

  const finalPoints: number[] = [];
  if (studentIdOrder?.length && gradePartsSortable) {
    for (let i = 0; i < studentIdOrder?.length; i++) {
      const eachStudentFinal = gradePartsSortable.map((gradePart) => {
        const gradePartPoint = gradePart.testid.map((test) => {
          const orderedTest = orderDoTest(test.doTest, studentIdOrder);
          const point = orderedTest[i]?.point;
          return (point ? point : 0) * test.scale;
        });
        return gradePartPoint
          .map((point) => point * gradePart.scale)
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      });

      finalPoints.push(
        eachStudentFinal.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        )
      );
    }
  }
  const addNewGradePart = () => {
    setGradePartsSortable((oldValue) => {
      if (!oldValue || !classId || !studentIdOrder) return;
      const newState: GradePart[] = window.structuredClone(oldValue);

      newState.push(
        createtempGradePart(classId, studentIdOrder, oldValue.length)
      );
      return newState;
    });
  };

  const onUpdateGrade = async () => {
    const filterFiles = gradePartsSortable?.map((gradePart) => ({
      ...gradePart,
      testid: [
        ...gradePart.testid.map((test) => ({
          ...test,
          content: {
            ...omit("files", test.content),
          },
        })),
      ],
    }));

    const newSubmitedFileName = gradePartsSortable
      ?.map((gradeParts) =>
        gradeParts.testid
          .map((test) =>
            test.content.files
              ? {
                  testId: test.id,
                  files: test.content.files.map((file) => file.name),
                }
              : undefined
          )
          .filter((el) => el !== undefined)
      )
      .flat();

    const newSubmitedFile = gradePartsSortable
      ?.map((gradeParts) =>
        gradeParts.testid
          .map((test) =>
            test.content.files
              ? {
                  testId: test.id,
                  files: test.content.files,
                }
              : undefined
          )
          .filter((el) => el !== undefined)
      )
      .flat();
    // const deleteOldFile =
    console.log(newSubmitedFile, JSON.stringify(newSubmitedFile), "alualaui");
    const formData = new FormData();
    formData.append("deleteFiles", JSON.stringify(deleteFiles));
    formData.append("gradeParts", JSON.stringify(filterFiles));
    if (classId) {
      formData.append("classId", classId);
    }
    formData.append("testAndNewFile", JSON.stringify(newSubmitedFileName));

    newSubmitedFile?.forEach((el) =>
      el?.files.forEach((file) => formData.append("files", file))
    );
    console.log("LMAO", newSubmitedFile);
    await api.post("/user/class/postUpdateGrade", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: onUpdateGrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`Class-Grade-${classId}`] });
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
  if (!students || !gradePartsSortable) return <SpinPage></SpinPage>;
  return (
    <div className=" w-full grid grid-cols-1 gap-4">
      <div className="grid grid-cols-[1fr_2fr_1fr] gap-5 ">
        <Button
          variant={gradingMode ? "secondary" : "outline"}
          onClick={() => setGradingMode((prev) => !prev)}
          id="ToggleGradingMode"
        >
          <PencilLine size={18}></PencilLine>
          <span className=" ml-2"> Toggle Grading mode </span>
        </Button>

        <SearchBar
          setValue={setSearchValue}
          className="w-[full] h-2"
        ></SearchBar>
        <div className=" flex  gap-2 items-stretch">
          <Button
            onClick={() => {
              if (!gradePartsSortable) return;
              createExcel(gradePartsSortable, students, finalPoints);
            }}
          >
            Export excel
          </Button>
          <Button
            className="flex-1"
            disabled={!validScale || !gradingMode || isNoChange || isPending}
            variant={!validScale ? "destructive" : "default"}
            onClick={() => {
              mutate();
              setGradingMode(false);
            }}
          >
            {!isPending ? (
              <>
                <Save size={18}></Save>
                <span className=" ml-2">
                  {!validScale ? "Wrong Scale !" : "Save Grade"}
                </span>
              </>
            ) : (
              <Spinner />
            )}
          </Button>
        </div>
      </div>
      <div className=" relative  w-full h-fit grid grid-cols-[1.5fr_8fr_0.6fr] border-solid border-[6px]  rounded-sm">
        <Col className="grid grid-cols-1 min-w-[180px] ">
          <Row className=" relative flex justify-center  h-[5rem] border-r-2 font-semibold">
            <span className=" flex gap-2 justify-center items-center">
              Students
            </span>
            {gradingMode && (
              <Plus
                onClick={() => addNewGradePart()}
                className=" text-secondary-foreground bg-secondary rounded-l-sm absolute right-0 top-0 h-[5rem] hover:bg-primary transition-colors"
                size={18}
              ></Plus>
            )}
          </Row>
          {students?.map((el, i) => (
            <Row
              key={`${el.userId}${i}`}
              className=" grid grid-cols-[3fr_2fr]  justify-center items-center  h-[4rem]   "
            >
              <div className="flex  gap-1  justify-center items-center ">
                <Avatar className="h-[30px] w-[30px]">
                  <AvatarImage src={el.student.avatar} alt="@shadcn" />
                  <AvatarFallback>{el.student.userName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-[0.8rem] font-medium leading-non">
                    {el.student.userName}
                  </span>
                </div>
              </div>
              <div className="text-[0.8rem] p-2 font-semibold border-l-2">
                {el.organizeId}
              </div>
            </Row>
          ))}
        </Col>
        <div className={`  overflow-auto scrollbar-none `}>
          <div
            className={`   min-w-full flex  `}
            // style={{
            //   gridTemplateColumns: `repeat(${gradePartsSortable?.length}, 1fr)`,
            // }}
          >
            {gradePartsSortable && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                modifiers={[restrictToHorizontalAxis]}
              >
                <TrashCan isdragging={isdragging}></TrashCan>

                <SortableContext
                  items={gradePartsSortable}
                  strategy={horizontalListSortingStrategy}
                >
                  {gradePartsSortable
                    .sort((a, b) => a?.sort - b?.sort)
                    ?.map((gradePart, i) => (
                      <GradePartComponent
                        className="flex-1"
                        gradePart={gradePart}
                        key={`${gradePart.name} ${i}`}
                        id={gradePart.id}
                        studentIdOrder={studentIdOrder}
                        isActive={gradePart.name == activeGradePart?.name}
                        activeTest={activeTest}
                        gradingMode={gradingMode}
                        checkValidGradePartScale={checkValidGradePartScale}
                        setGradePartsSortable={setGradePartsSortable}
                        findContainerGradePart={findContainerGradePart}
                        classId={classId}
                      ></GradePartComponent>
                    ))}
                </SortableContext>

                <DragOverlay>
                  {activeGradePart && (
                    <GradePartComponent
                      checkValidGradePartScale={true}
                      key={activeGradePart.id}
                      gradePart={activeGradePart}
                      id={activeGradePart.id + "overlay"}
                      studentIdOrder={studentIdOrder}
                      className=" backdrop-filter  backdrop-blur-sm bg-opacity-0 border-solid border-2"
                      gradingMode={gradingMode}
                    ></GradePartComponent>
                  )}
                  {activeTest && (
                    <TestComponent
                      checkValidScaleTest={true}
                      id={activeTest.id + "overlay"}
                      test={activeTest}
                      studentIdOrder={studentIdOrder}
                      isOverlay={true}
                      gradingMode={gradingMode}
                      className=" backdrop-filter  backdrop-blur-sm bg-opacity-0 outline-2 outline outline-secondary"
                    ></TestComponent>
                  )}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </div>
        <Col className="grid grid-cols-1  min-w-[75px]">
          <Row className=" flex justify-center   h-[5rem] border-r-2 font-semibold text-center">
            Final <br></br> grade
          </Row>
          {finalPoints.map((studentPoint, i) => (
            <Row
              className=" flex justify-center  h-[4rem] border-r-2 font-semibold"
              key={i}
            >
              <span>{studentPoint.toFixed(2)}</span>
            </Row>
          ))}
        </Col>
      </div>
    </div>
  );
}

function TrashCan({ isdragging }: { isdragging: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: "trashCan",
  });

  return (
    <div
      ref={setNodeRef}
      className={` ${isdragging ? "opacity-100" : "opacity-0 "}  
      ${isOver ? "bg-destructive" : " bg-muted-foreground"}
      transition-all opacity-0 absolute  flex justify-center items-center h-[5rem] w-[3rem] left-[-3.7rem] rounded-lg`}
    >
      <Trash2 className="text-white"></Trash2>
    </div>
  );
}

function omit<T extends Record<string, unknown>>(
  key: string,
  obj: T
): Omit<T, typeof key> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [key]: omitted, ...rest } = obj;
  return rest;
}
