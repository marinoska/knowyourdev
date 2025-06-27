import {
  ScopePeriod,
  TScopeActivity,
  TScopes,
} from "@/pages/Core/ResumeProfileContext.ts";
import { ScopeType } from "@kyd/common/api";

type UseCandidateMatchParams = {
  candidateScopes: TScopes;
  scopeCodes: ScopeType[];
  expectedRecentRelevantYears: number;
};

export type TTechFocusMatch = {
  descNormalizedActivityScoreList: number[];
  descActivityPeriods: ScopePeriod[];
  totalActiveMonths: number;
  overallScore: number;
  maxScore: number;
};

type TCandidateTechFocusMatch = Record<ScopeType, TTechFocusMatch>;

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
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    ) || [];

  const lastPeriods = sortedPeriods.slice(0, MAX_SCORED_YEARS) || [];

  const descNormalizedActivityScoreList = lastPeriods.map(
    ({ totalMonths }) => (totalMonths * 100) / 12,
  );

  const totalActiveMonth = lastPeriods
    .map((period) => period.totalMonths)
    .reduce((acc, val) => acc + val, 0);

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
  candidateScopes,
  scopeCodes,
  expectedRecentRelevantYears,
}: UseCandidateMatchParams): TCandidateTechFocusMatch => {
  const results: TCandidateTechFocusMatch = {} as TCandidateTechFocusMatch;

  for (const scopeCode of scopeCodes) {
    results[scopeCode] = processCandidateScope({
      candidateScope: candidateScopes[scopeCode],
      expectedRecentRelevantYears,
    });
  }

  return results;
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
