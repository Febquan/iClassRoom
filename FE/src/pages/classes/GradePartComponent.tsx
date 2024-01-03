import { GripVertical, Plus } from "lucide-react";
import {
  Dispatch,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { GradePart, Test } from "@/ultis/appType";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TestComponent } from "./TestComponent";
import { Col, RowHeader, Row } from "./MyTableAtom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function GradePartComponent({
  id,
  gradePart,
  studentIdOrder,
  className,
  isActive,
  activeTest,
  gradingMode,
  checkValidGradePartScale,
  setGradePartsSortable,
  findContainerGradePart,
  classId,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  id: string;
  gradePart: GradePart;
  isActive?: boolean;
  activeTest?: Test;
  gradingMode: boolean;
  checkValidGradePartScale: boolean;
  studentIdOrder: string[] | undefined;
  classId?: string;
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

  const checkValidScaleTest =
    1 ==
    gradePart.testid?.reduce(
      (accumulator, currentValue) => accumulator + currentValue.scale,
      0
    );
  const addTestToGradePart = () => {
    if (!setGradePartsSortable) return;
    setGradePartsSortable((oldValue) => {
      if (!setGradePartsSortable || !oldValue || !studentIdOrder) return;
      const newState = window.structuredClone(oldValue);
      const containerIndex = oldValue.findIndex((el) => el.id === id);

      newState[containerIndex].testid.push(
        createtempTest(
          studentIdOrder,
          oldValue[containerIndex].testid.length,
          id,
          classId!
        )
      );
      return newState;
    });
  };

  return (
    <Col
      className={` relative min-w-fit ${className}  ${
        isActive && "opacity-30  border-solid border-1"
      } font-semibold `}
      {...props}
      ref={setNodeRef}
      style={style}
    >
      {gradingMode && (
        <>
          <span
            {...listeners}
            {...attributes}
            className=" absolute right-1 top-[10px]"
          >
            <GripVertical size={18}></GripVertical>
          </span>
        </>
      )}
      <RowHeader containTest={true}>
        <Row
          className={` w-full flex justify-center items-center h-[2.5rem]  border-l-[1px]  border-r-[1px] ${
            gradingMode &&
            !checkValidGradePartScale &&
            "border-solid border-b-[6px] border-destructive"
          }`}
        >
          <div className="flex gap-3 justify-center items-center cursor-pointer">
            {!gradingMode && <span>{gradePart.name} </span>}
            <span className=" flex gap-2 justify-center  items-center">
              {gradingMode && (
                <>
                  <GratePartModal
                    gradePart={gradePart}
                    setGradePartsSortable={setGradePartsSortable}
                  >
                    <span>{gradePart.name} </span>
                  </GratePartModal>
                  <span> | {gradePart.scale} </span>
                  <span onClick={addTestToGradePart}>
                    <Plus
                      className=" rounded  text-secondary-foreground bg-secondary  hover:bg-green-500 transition-colors"
                      size={18}
                    ></Plus>
                  </span>
                </>
              )}
            </span>
          </div>
        </Row>
        <div
          className={` grid  w-full   `}
          style={{
            gridTemplateColumns: `repeat(${gradePart.testid.length}, 1fr)`,
          }}
        >
          {gradePart.testid.map((test, l) => (
            <div className=" text-center" key={`${test.name} ${l}`}></div>
          ))}
        </div>
      </RowHeader>

      <div
        className={` grid  w-full `}
        style={{
          gridTemplateColumns: `repeat(${gradePart.testid.length}, 1fr)`,
        }}
      >
        <SortableContext
          items={gradePart.testid}
          strategy={horizontalListSortingStrategy}
        >
          {gradePart.testid
            .sort((a, b) => a?.sort - b?.sort)
            .map((test, j) => (
              <TestComponent
                id={test.id}
                key={`${test.name} ${j}`}
                test={test}
                studentIdOrder={studentIdOrder}
                isActive={activeTest && test && test.id == activeTest?.id}
                gradingMode={gradingMode}
                checkValidScaleTest={checkValidScaleTest}
                setGradePartsSortable={setGradePartsSortable}
                findContainerGradePart={findContainerGradePart}
              ></TestComponent>
            ))}
        </SortableContext>
      </div>
    </Col>
  );
}

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UniqueIdentifier } from "@dnd-kit/core";
import { createtempTest } from "@/ultis/classFunctions";

const Schema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name cannot be empty" })
      .max(30, { message: " Name is too long" }),
    scale: z.coerce.number(),
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

function GratePartModal({
  children,
  gradePart,
  setGradePartsSortable,
}: {
  children: ReactNode;
  gradePart: GradePart;
  setGradePartsSortable?: Dispatch<SetStateAction<GradePart[] | undefined>>;
}) {
  const form = useForm<SchemaType>({
    resolver: zodResolver(Schema),
  });

  const onChangeInfo = async (formData: SchemaType) => {
    console.log(formData);
    if (!setGradePartsSortable) return;
    setGradePartsSortable((oldValue) => {
      if (!oldValue) return;
      const newState: GradePart[] = window.structuredClone(oldValue);
      const containerIndex = oldValue.findIndex((el) => el.id === gradePart.id);

      newState[containerIndex].name = formData.name;
      newState[containerIndex].scale = formData.scale;
      return newState;
    });
    form.reset();
    setOpen(false);
  };
  const [open, setOpen] = useState(false);
  useEffect(() => {
    form.reset();
    form.setValue("name", gradePart.name);
    form.setValue("scale", gradePart.scale);
  }, [form, gradePart.name, gradePart.scale, open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onChangeInfo)}
              className="space-y-3"
              id="changeGradePartInfo"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade category name</FormLabel>
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
                    <FormLabel>Grade category scale</FormLabel>
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
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button type="submit" form="changeGradePartInfo">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
