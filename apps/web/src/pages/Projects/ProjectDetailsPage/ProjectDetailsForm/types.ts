import { ScopeType } from "@kyd/common/api";

export type ProjectFormValues = {
  name: string;
  settings: {
    description: string;
    // Stores the last description when system parameters were last synced
    lastSyncedDescription: string;
    // Derived: true if description differs from lastSyncedDescription
    isDescriptionOutOfSync: boolean;
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
