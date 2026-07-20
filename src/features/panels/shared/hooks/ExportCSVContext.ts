import { createContext, useContext } from "react";

export const ExportCSVFnContext = createContext<(() => void) | undefined>(undefined);

export const useExportCSVFn = () => useContext(ExportCSVFnContext);
