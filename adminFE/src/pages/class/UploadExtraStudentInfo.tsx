import * as XLSX from "xlsx";
import { Form, useForm } from "react-hook-form";
import Dropzone from "@/ultis/DropZone";
import { FormField } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";

import { createTemplate } from "@/ultis/classFunctions";
import { DataTable } from "@/components/ui/data-table-roster";
import FormError from "./FormError";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import api from "@/axios/axios";
import { ExtraTable, MyError } from "@/ultis/appType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGetClassId } from "../customhook/cusHook";
import { useToast } from "@/components/ui/use-toast";
import { createColumnOnDynamicFields } from "@/ultis/classFunctions";
export default function UploadExtraStudentInfo() {
  const form = useForm<{ files?: File[] }>();
  const files = form.watch("files");
  console.log(files, "wwwww");
  const [extraInfo, setExtraInfo] = useState<ExtraTable[]>([]);
  const [isValidKeys, setIsValid] = useState<boolean>(false);

  const [columns, setColumns] = useState<ColumnDef<ExtraTable>[]>([]);
  useEffect(() => {
    const reader = new FileReader();
    if (files?.length == 0 || !files) {
      setExtraInfo([]);

      return;
    }
    reader.readAsBinaryString(files[0]);
    reader.onload = (e) => {
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
  }, [files, isValidKeys]);

  const queryClient = useQueryClient();
  const classId = useGetClassId();
  const { toast } = useToast();
  const onExtraInfoUpload = () => {
    mutate(extraInfo);
  };
  const ExtraInfoChange = async (extraInfo: ExtraTable[]) => {
    await api.post("admin/class/postClassExtraInfo", { extraInfo, classId });
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
    <div className=" w-full flex flex-col  relative gap-2">
      <Button
        className="absolute right-2 top-[-45px]"
        variant="ghost"
        onClick={() => createTemplate(["Student id", "Name"])}
      >
        Dowload Template
      </Button>
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="files"
            render={() => (
              <Dropzone
                multiple={false}
                accept={{
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    [".xlsx"],
                  "application/vnd.ms-excel": [".xls"],
                }}
                form={form}
              ></Dropzone>
            )}
          />
        </form>
      </Form>
      {extraInfo?.length > 0 && (
        <DataTable columns={columns} data={extraInfo}></DataTable>
      )}

      <div>
        {extraInfo?.length > 0 && !isValidKeys && (
          <FormError>File must have Student id field</FormError>
        )}
      </div>
      <Button
        className="mt-3"
        onClick={onExtraInfoUpload}
        disabled={!(extraInfo?.length > 0) && !isValidKeys}
      >
        {isPending ? <Spinner></Spinner> : "Change"}
      </Button>
    </div>
  );
}
