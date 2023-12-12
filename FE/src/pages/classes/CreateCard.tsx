import api from "@/axios/axios";
import { useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  //   SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ROLE, UserInfo } from "@/ultis/appType";

const Schema = z
  .object({
    className: z
      .string()
      .min(1, { message: "Class name cannot be empty" })
      .max(30, { message: "Class Name is too long" }),
    role: z.enum(ROLE),
    studentId: z.string().optional(),
  })
  .refine(
    (data) => {
      return data.role === "student" ? data.studentId !== undefined : true;
    },
    {
      message: "Student id cannot be empty when the role is student",
      path: ["studentId"],
    }
  );
type SchemaType = z.infer<typeof Schema>;

export default function CreateCard() {
  const form = useForm<SchemaType>({
    resolver: zodResolver(Schema),
  });
  const role = form.watch("role");
  const { data } = useQuery<UserInfo | undefined>({ queryKey: ["userInfo"] });
  const [open, setOpen] = useState(false);
  const createMutate = async (formData: SchemaType) => {
    await api.post("/user/class/createClass", {
      ...formData,
      userId: data?.userId,
    });
    setOpen(false);
  };
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutattion = useMutation({
    mutationFn: createMutate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userClasses"] });
      toast({
        title: "Class created !",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request. ",
      });
    },
  });
  const onCreateClass = async (formData: SchemaType) => {
    mutattion.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        asChild
        onClick={() => {
          form.reset();
        }}
      >
        <div className=" h-[15rem] cursor-pointer  w-full outline-dashed  outline-2 rounded-md opacity-20 flex justify-center items-center transition-transform hover:bg-accent hover:scale-[1.08] hover:text-accent-foreground">
          <div className=" flex justify-center items-center flex-col gap-3">
            <PlusCircle size={40}></PlusCircle>
            <span className=" text-[0.8rem] font-bold">CREATE NEW CLASS</span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new class</DialogTitle>
          <DialogDescription>
            Please submit your class infomation below
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onCreateClass)}
            className="space-y-3"
            id="classCreate"
          >
            <FormField
              control={form.control}
              name="className"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Name of your class</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role: </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Are you a student or a teacher ?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {role == "student" ? (
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student id:</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      A unique id to identify a student in a class
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
          </form>
        </Form>

        <DialogFooter>
          <Button type="submit" className="w-full" form="classCreate">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
