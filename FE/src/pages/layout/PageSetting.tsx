import { ReactNode } from "react";

export default function PageSetting({
  children,
  ...rest
}: { children: ReactNode } & React.HTMLProps<HTMLDivElement>) {
  return (
    <div {...rest} className={`p-[5rem] ${rest.className}`}>
      {children}
    </div>
  );
}
