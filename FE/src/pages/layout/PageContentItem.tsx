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
  return <>{pageContext?.classPage === tabName && <div>{children}</div>}</>;
}
