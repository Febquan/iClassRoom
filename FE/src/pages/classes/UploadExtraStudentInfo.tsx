import * as XLSX from "xlsx";
import { Form, useForm } from "react-hook-form";
import Dropzone from "@/ultis/DropZone";
import { FormField } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";
import FormError from "./FormError";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import api from "@/axios/axios";
import { ExtraTable, MyError } from "@/ultis/appType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetClassId } from "../customhook/classCustomHooks";
import { useToast } from "@/components/ui/use-toast";
import { createColumnOnDynamicFields } from "@/ultis/classFunctions";
export default function UploadExtraStudentInfo() {
  const form = useForm<{ files?: File[] }>();
  const files = form.watch("files");
  console.log(files, "wwwww");
  const [extraInfo, setExtraInfo] = useState<ExtraTable[]>([]);
  const [isValidKeys, setIsValid] = useState<boolean>(false);
  const [isFirstInput, setisFirstInput] = useState<boolean>(true);
  const [columns, setColumns] = useState<ColumnDef<ExtraTable>[]>([]);
  useEffect(() => {
    const reader = new FileReader();
    if (files?.length == 0 || !files) {
      setExtraInfo([]);
      setisFirstInput(true);
      return;
    }
    reader.readAsBinaryString(files[0]);
    reader.onload = (e) => {
      !isFirstInput && setisFirstInput(false);
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData: ExtraTable[] = XLSX.utils.sheet_to_json(sheet);
      console.log(parsedData);
      setExtraInfo(parsedData);
      const fields = Object.keys(parsedData[0]);
      setIsValid(fields.includes("Student Id"));
      console.log(isValidKeys);
      setColumns(createColumnOnDynamicFields(fields));
    };
  }, [files, isValidKeys, isFirstInput]);

  const queryClient = useQueryClient();
  const classId = useGetClassId();
  const { toast } = useToast();
  const onExtraInfoUpload = () => {
    mutate(extraInfo);
  };
  const ExtraInfoChange = async (extraInfo: ExtraTable[]) => {
    await api.post("user/class/postClassExtraInfo", { extraInfo, classId });
  };
  const { mutate, isPending } = useMutation({
    mutationFn: ExtraInfoChange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`Class-${classId}`] });
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
  return (
    <div className=" w-full flex flex-col gap-5">
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="files"
            render={() => <Dropzone multiple={false} form={form}></Dropzone>}
          />
        </form>
      </Form>
      {extraInfo?.length > 0 && (
        <DataTable columns={columns} data={extraInfo}></DataTable>
      )}

      <div>
        {!isFirstInput && !isValidKeys && (
          <FormError>File must have Student id field</FormError>
        )}
      </div>
      <Button
        className="mt-3"
        onClick={onExtraInfoUpload}
        disabled={!isValidKeys}
      >
        {isPending ? <Spinner></Spinner> : "Change"}
      </Button>
    </div>
  );
}
