import { ReactNode } from "react";

export default function FormError({ children }: { children: ReactNode }) {
  return (
    <span className="text-red-500 text-center w-full block">{children}</span>
  );
}
