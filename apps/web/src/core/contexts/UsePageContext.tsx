import { useContext } from "react";
import { PageContextType, PageContext } from "@/core/contexts/PageContext.tsx";

export const usePageContext = (): PageContextType => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePageContext must be used within a PageContextProvider");
  }
  return context;
};
