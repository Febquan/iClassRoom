import ClassCard from "./ClassCard";
import PageSetting from "../layout/PageSetting";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SearchBar } from "@/components/ui/search";
// import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import CreateCard from "./CreateCard";
import { useQueryClient } from "@tanstack/react-query";

import {
  useGetAllUSerClass,
  useGetUserInfo,
} from "../customhook/classCustomHooks";
import { userToClass } from "@/ultis/appType";
import JoinByCode from "./JoinByCode";

export default function ClassPage() {
  const [activeElement, setActiveElement] = useState<userToClass>();
  const [search, setSearch] = useState<string>("");
  const queryClient = useQueryClient();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const activeClass = classes?.find((el) => el.id === active.id);
    setActiveElement(activeClass);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      queryClient.setQueryData(["userClasses"], (oldClasses: userToClass[]) => {
        const arrayOfClassId = oldClasses.map((el) => el.id);
        const oldIndex = arrayOfClassId?.indexOf(active.id as string);
        const newIndex = arrayOfClassId?.indexOf(over?.id as string);
        return arrayMove(oldClasses!, oldIndex!, newIndex!);
      });
    }
    setActiveElement(undefined);
  }
  const { userInfo } = useGetUserInfo();
  const { classes, isSuccess } = useGetAllUSerClass(userInfo!.userId);
  // console.log(classes?.[0].courseId);

  return (
    <PageSetting>
      <div className="flex justify-between">
        <SearchBar setValue={setSearch} className="w-[25rem]"></SearchBar>
        <JoinByCode></JoinByCode>
      </div>
      <div
        className=" mt-10"
        style={{
          display: "grid",
          gap: "2rem",
          gridTemplateColumns: "repeat(auto-fill,minmax(350px, 1fr)",
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {isSuccess && (
            <SortableContext
              items={classes as userToClass[]}
              strategy={rectSortingStrategy}
            >
              {classes
                ?.filter((value) => value.class.className.includes(search))
                .map((items) => (
                  <ClassCard
                    id={items.id}
                    className={`${
                      items.id == activeElement?.id ? "opacity-40" : ""
                    }`}
                    key={items.id}
                    myClassName={items.class.className}
                    role={items.role}
                    classId2={items.courseId}
                    // organizeId={items.organizeId}
                    numberOfStudent={items.class.haveStudent.length}
                    isOwnner={items.class.createBy === userInfo?.userId}
                    allStudent={items.class.haveStudent.map((student) => ({
                      src: student.student.avatar,
                      name: student.student.userName,
                      studentClassId: student.organizeId,
                    }))}
                  ></ClassCard>
                ))}
            </SortableContext>
          )}
          <DragOverlay>
            {activeElement !== undefined ? (
              <ClassCard
                classId2={activeElement.courseId}
                id={activeElement.id}
                key={activeElement.id}
                myClassName={activeElement.class.className}
                role={activeElement.role}
                // organizeId={activeElement.organizeId}
                numberOfStudent={activeElement.class.haveStudent.length}
                isOwnner={activeElement.class.createBy === userInfo?.userId}
                allStudent={activeElement.class.haveStudent.map((student) => ({
                  src: student.student.avatar,
                  name: student.student.userName,
                  studentClassId: student.organizeId,
                }))}
              />
            ) : undefined}
          </DragOverlay>
          {isSuccess && <CreateCard></CreateCard>}
        </DndContext>
      </div>
    </PageSetting>
  );
}
