import ClassCard from "./ClassCard";
import PageSetting from "../layout/PageSetting";
import api from "@/axios/axios";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserInfo } from "@/ultis/appType";
import { useToast } from "@/components/ui/use-toast";

type Student = {
  avatar: string;
  email: string;
  userName: string;
};
type ClassToStudent = {
  courseId: string;
  organizeId: string;
  role: "student" | "teacher";
  userId: string;
  student: Student;
};
export type Class = {
  id: string;
  className: string;
  createBy: string;
  createdAt: string;
  haveStudent: ClassToStudent[];
};
export type userToClass = {
  id: string;
  class: Class;
  courseId: string;
  organizeId: string;
  role: "student" | "teacher";
  userId: string;
};

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
        console.log(oldClasses, "asdfasdfasdfasdf");
        const arrayOfClassId = oldClasses.map((el) => el.id);
        const oldIndex = arrayOfClassId?.indexOf(active.id as string);
        const newIndex = arrayOfClassId?.indexOf(over?.id as string);
        return arrayMove(oldClasses!, oldIndex!, newIndex!);
      });
    }
    setActiveElement(undefined);
  }
  const { toast } = useToast();
  const { data: userInfo } = useQuery<UserInfo | undefined>({
    queryKey: ["userInfo"],
  });
  const fetchAllClass = async () => {
    try {
      const res = await api.get(`user/class/getAllClass/${userInfo?.userId}`);
      const addedIndexClasses = res.data.classes.map((el: userToClass) => {
        return { ...el, id: el.courseId };
      });
      return addedIndexClasses;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      console.log(err);
    }
  };
  const { data: classes, isSuccess } = useQuery<userToClass[] | undefined>({
    queryKey: ["userClasses"],
    queryFn: fetchAllClass,
    staleTime: Infinity,
  });
  // console.log(classes?.[0].courseId);
  return (
    <PageSetting>
      <div className="flex justify-center">
        <SearchBar setValue={setSearch} className="w-[25rem]"></SearchBar>
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
