import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchBar({
  setValue,
  className,
}: {
  setValue: React.Dispatch<React.SetStateAction<string>>;
  className: string;
}) {
  return (
    <div className={`${className} flex items-center space-x-2 relative h-fit `}>
      <Input
        type="text"
        placeholder="Search"
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className=" font-bold text-lg "
      />
      <Search className=" absolute right-3 top-1"></Search>
    </div>
  );
}
