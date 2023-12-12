import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UseFormReturn } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const baseStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderStyle: "dashed",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export default function Dropzone({
  multiple,
  form,
  ...rest
}: {
  multiple?: boolean;
  form: UseFormReturn<
    {
      title: string;
      files?: File[];
      description: string;
    },
    undefined
  >;
}) {
  const [filesName, setFileName] = useState<string[] | undefined>([]);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      form.setValue("files", acceptedFiles as File[], {
        shouldValidate: true,
      });
    },
    [form]
  );
  const files = form.getValues().files;
  useEffect(() => {
    setFileName(files?.map((el) => el.name));
  }, [files]);
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    isDragActive,
  } = useDropzone({
    onDrop,
    multiple,
    ...rest,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  function cancelFile(name: string) {
    form.setValue("files", files?.filter((el) => el.name != name) as File[], {
      shouldValidate: true,
    });
  }

  return (
    <div
      {...getRootProps({ style })}
      className=" flex-col rounded-3xl justify-center items-center h-full"
    >
      <input type="file" name="files" {...getInputProps()} />
      <span className="text-[0.8rem] text-center font-semibold">
        {!filesName?.length &&
          (isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          ))}
      </span>
      <div>
        <ul className=" flex flex-col justify-center items-center gap-2">
          {filesName?.map((name, i) => (
            <li key={`${name}${i}`}>
              <Badge variant="secondary" className="text-[1rem] px-5 relative">
                {name}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    cancelFile(name);
                  }}
                  className=" rounded-full  bg-destructive absolute top-[-0.3rem] right-[-0.5rem]"
                >
                  <X size={15}></X>
                </div>
              </Badge>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
