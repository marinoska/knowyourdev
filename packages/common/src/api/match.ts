import { ActivityPeriod } from "./resumeProfile.js";
import { ScopeType } from "./constants.js";

export type TTechFocusMatch = {
  descNormalizedActivityScoreList: number[];
  descActivityPeriods: ActivityPeriod[];
  totalActiveMonths: number;
  overallScore: number;
  maxScore: number;
};

export type TTechMatch = {
  descNormalizedActivityScoreList: number[];
  descActivityPeriods: ActivityPeriod[];
  totalActiveMonths: number;
  overallScore: number;
  maxScore: number;
};

export type TCandidateMatch = {
  techFocusMatch: Record<ScopeType, TTechFocusMatch>;
  techFocusAvgScore: number;
  techMatch: Record<string, TTechMatch>;
  techAvgScore: number;
  overallMatch: number;
  averageJobDuration: number;
  baselineJobDuration: number;
  jobStabilityScore: number;
};
