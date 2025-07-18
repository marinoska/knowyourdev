import { ScopeType } from "@kyd/common/api";

export type ProjectFormValues = {
  name: string;
  settings: {
    description: string;
    baselineJobDuration: number;
    expectedRecentRelevantYears: number;
    techFocus: ScopeType[];
    technologies: Array<{
      ref: string;
      code: string;
      name: string;
    }>;
  };
};
