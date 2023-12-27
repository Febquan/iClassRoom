import { ReactNode, useContext } from "react";
import { PageContext } from "./PageContent";

export default function PageContentItem({
  tabName,
  children,
}: {
  tabName: string;
  children: ReactNode;
}) {
  const pageContext = useContext(PageContext);
  return (
    <>
      {pageContext?.classPage === tabName && (
        <div className="w-full flex justify-center items-center">
          {children}
        </div>
      )}
    </>
  );
}
