import { ScopePeriod, ScopeType, TScopeActivity } from "@kyd/common/api";
import { TProject, TResumeProfile } from "@/api/query/types.ts";

type UseCandidateMatchParams = {
  project?: TProject;
  profile?: TResumeProfile;
};

export type TTechFocusMatch = {
  descNormalizedActivityScoreList: number[];
  descActivityPeriods: ScopePeriod[];
  totalActiveMonths: number;
  overallScore: number;
  maxScore: number;
};

export type TCandidateTechFocusMatch = {
  techFocusMatch: Record<ScopeType, TTechFocusMatch>;
  techFocusAvgScore: number;
  overallMatch: number;
  averageJobDuration: number;
  baselineJobDuration: number;
  jobStabilityScore: number;
};

const MAX_SCORED_YEARS = 10;

type ProcessCandidateScopeInput = {
  candidateScope: TScopeActivity;
  expectedRecentRelevantYears: number;
};

const processCandidateScope = ({
  candidateScope = { periods: [], years: [] },
  expectedRecentRelevantYears,
}: ProcessCandidateScopeInput): TTechFocusMatch => {
  // sort desc
  const sortedPeriods =
    candidateScope?.periods?.sort(
      (a: ScopePeriod, b: ScopePeriod) => b.start.getTime() - a.start.getTime(),
    ) || [];

  const lastPeriods = sortedPeriods.slice(0, MAX_SCORED_YEARS) || [];

  const descNormalizedActivityScoreList = lastPeriods.map(
    ({ totalMonths }: { totalMonths: number }) => (totalMonths * 100) / 12,
  );

  const totalActiveMonth = lastPeriods
    .map((period: ScopePeriod) => period.totalMonths)
    .reduce((acc: number, val: number) => acc + val, 0);

  // score for all periods
  const { score } = calculateTechFocusScore(lastPeriods);
  // max score for the expected periods, could be less then the max score for all last periods
  // if the real yaers of experience are more then expected
  const maxScore = calculateMaxScoreForYears(expectedRecentRelevantYears);
  // normalize to percentages and cap to 100 if bigger
  const overallScore = Math.min((score / maxScore) * 100, 100);

  return {
    descNormalizedActivityScoreList,
    descActivityPeriods: lastPeriods,
    totalActiveMonths: totalActiveMonth,
    overallScore,
    maxScore,
  };
};

export const useCandidateMatch = ({
  project,
  profile,
}: UseCandidateMatchParams): TCandidateTechFocusMatch => {
  // If either project or profile is missing, return default empty result
  if (!project || !profile) {
    return {
      techFocusMatch: {} as Record<ScopeType, TTechFocusMatch>,
      techFocusAvgScore: 0,
      overallMatch: 0,
      averageJobDuration: 0,
      baselineJobDuration: 0,
      jobStabilityScore: 0,
    };
  }

  const { scopes: candidateScopes, averageJobDuration } = profile;
  const {
    techFocus: expectedScopes,
    expectedRecentRelevantYears,
    baselineJobDuration,
  } = project.settings;

  const techFocusMatch = {} as Record<ScopeType, TTechFocusMatch>;
  let techFocusAvgScore = 0;
  let overallMatch = 0;

  for (const scopeCode of expectedScopes) {
    techFocusMatch[scopeCode] = processCandidateScope({
      candidateScope: candidateScopes[scopeCode],
      expectedRecentRelevantYears,
    });
    techFocusAvgScore += techFocusMatch[scopeCode].overallScore;
  }
  techFocusAvgScore = techFocusAvgScore / expectedScopes.length;
  overallMatch = techFocusAvgScore;

  const jobStabilityScore = Math.min(
    (averageJobDuration / baselineJobDuration) * 100,
    100,
  );

  return {
    techFocusMatch,
    techFocusAvgScore,
    overallMatch,
    averageJobDuration,
    baselineJobDuration,
    jobStabilityScore,
  };
};

/**
 * Calculate recency-weighted score and max score for a given tech.
 */
const calculateTechFocusScore = (
  periods: ScopePeriod[],
): { score: number; maxScore: number } => {
  let score = 0;
  let maxScore = 0;

  const periodsToEvaluate = periods.slice(0, MAX_SCORED_YEARS);

  periodsToEvaluate.forEach((period, index) => {
    const weight = 1 - index * 0.1;
    score += period.totalMonths * weight;
    maxScore += 12 * weight; // Assuming 12 months is the max for any year
  });

  return { score, maxScore };
};

/**
 * Calculate the maximum possible score for amount of years.
 */
const calculateMaxScoreForYears = (years: number) => {
  let maxScore = 0;

  // Iterate over 10 years (or maximum 10 indices) and calculate the weighted max score
  for (let index = 0; index < years; index++) {
    const weight = 1 - index * 0.1; // Decreasing weight for older years
    maxScore += 12 * weight; // Assume 12 months per year (1 year = 12 months)
  }

  return maxScore;
};
