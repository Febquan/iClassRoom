import { Badge } from "@/components/ui/badge";
import { File } from "lucide-react";
import { downloadFile, getFileName } from "@/ultis/classFunctions";

export const FileComponent = ({ fileKey }: { fileKey: string }) => {
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
        <span> {getFileName(fileKey)} </span>
      </Badge>
    </div>
  );
};
