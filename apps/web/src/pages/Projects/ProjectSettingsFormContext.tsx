import { useContext } from "react";
import {
  ProjectSettingsFormContext,
  ProjectSettingsContextType,
} from "./ProjectSettingsFormProvider.tsx";

export const useProjectSettingsFormContext = (): ProjectSettingsContextType => {
  const context = useContext(ProjectSettingsFormContext);
  if (!context) {
    throw new Error(
      "useProjectSettingsFormContext must be used within a ProjectSettingsFormProvider",
    );
  }
  return context;
};
