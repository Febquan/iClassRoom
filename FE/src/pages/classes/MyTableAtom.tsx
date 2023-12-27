import { HTMLAttributes, Ref, forwardRef } from "react";

export function Row({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={` grid  items-center justify-center border-solid  border-t-[1px] border-b-[1px] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function RowHeader({
  children,
  className,
  containTest,
  ...props
}: HTMLAttributes<HTMLDivElement> & { containTest: boolean }) {
  return (
    <div
      className={`grid grid-rows-${containTest ? 2 : 1} h-[5rem] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export const Col = forwardRef(
  (
    { children, className, ...props }: HTMLAttributes<HTMLDivElement>,
    ref: Ref<HTMLDivElement>
  ) => {
    return (
      <div ref={ref} className={` ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
