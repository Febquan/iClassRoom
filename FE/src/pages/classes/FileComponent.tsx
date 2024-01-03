import { Badge } from "@/components/ui/badge";
import { File } from "lucide-react";
import {
  downloadFile,
  getFileName,
  getFileNameOfTest,
} from "@/ultis/classFunctions";

export const FileComponent = ({
  fileKey,
  isTestFile,
}: {
  fileKey: string;
  isTestFile?: boolean;
}) => {
  return (
    <div>
      <Badge
        variant="secondary"
        className="text-[1rem] px-2 w-fit flex gap-2 cursor-pointer"
        onClick={() => {
          downloadFile(fileKey);
        }}
      >
        <File size={20}></File>
        <span>
          {" "}
          {isTestFile ? getFileNameOfTest(fileKey) : getFileName(fileKey)}{" "}
        </span>
      </Badge>
    </div>
  );
};
