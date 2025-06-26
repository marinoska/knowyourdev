import {
  ScopePeriod,
  TScopeActivity,
  TScopes,
} from "@/pages/Core/ResumeProfileContext.ts";
import { monthsToYearsAndMonths } from "@/utils/dates.ts";
import { format } from "date-fns";
import { ColorPaletteProp } from "@mui/joy/styles";
import { ScopeType } from "@kyd/common/api";

type UseTechFocusActivityParams = {
  candidateScopes: TScopes;
  scopeCodes: ScopeType[];
  expectedRecentRelevantYears: number;
  order: "asc" | "desc";
};

export type TTechFocusActivity = {
  normalizedActivityList: number[];
  hintList: string[];
  pillsCaption: string;
  techNames: string;
  activeMonthsAndYears: {
    years: number;
    months: number;
  };
  overallScore: number;
  maxScore: number;
  color: ColorPaletteProp;
};

type UseTechFocusActivityResults = Record<ScopeType, TTechFocusActivity>;

const MAX_SCORED_YEARS = 10;

type ProcessCandidateScopeInput = {
  candidateScope: TScopeActivity;
  expectedRecentRelevantYears: number;
  order: "asc" | "desc";
};

const processCandidateScope = ({
  candidateScope = { periods: [], years: [] },
  expectedRecentRelevantYears,
  order,
}: ProcessCandidateScopeInput): TTechFocusActivity => {
  // sort desc
  const sortedPeriods =
    candidateScope?.periods?.sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    ) || [];

  const lastPeriods = sortedPeriods.slice(0, MAX_SCORED_YEARS) || [];
  // const numPeriodsToPad = Math.max(
  //   0,
  //   expectedRecentRelevantYears - lastPeriods.length,
  // );
  // for (let i = 0; i++; i < numPeriodsToPad) {
  //   lastPeriods.push({
  //     startDate: subMonths(lastPeriods[lastPeriods.length - 1].startDate, 12),
  //     endDate: subMonths(lastPeriods[lastPeriods.length - 1].endDate, 12),
  //     totalMonths: 0,
  //     technologies: [],
  //   });
  // }

  const normalizedActivityList = lastPeriods.map(
    ({ totalMonths }) => (totalMonths * 100) / 12,
  );
  const hintList = lastPeriods.map(
    ({ totalMonths, endDate, startDate }) =>
      `${totalMonths} months within period ${format(startDate, "MM.yy")}-${format(endDate, "MM.yy")} `,
  );
  const pillsCaption =
    lastPeriods.length > 0
      ? `${lastPeriods[lastPeriods.length - 1].startDate.getFullYear()}-${lastPeriods[0].endDate.getFullYear()}`
      : "";

  const techNameArray = lastPeriods
    .map((period) => period.technologies.map((tech) => tech.name))
    .flat();
  const techNames = Array.from(new Set(techNameArray)).join(", ");

  const totalActiveMonth = lastPeriods
    .map((period) => period.totalMonths)
    .reduce((acc, val) => acc + val, 0);

  const activeMonthsAndYears = monthsToYearsAndMonths(totalActiveMonth);

  // score for all periods
  const { score } = calculateTechFocusScore(lastPeriods);
  // max score for the expected periods, could be less then the max score for all last periods
  // if the real yaers of experience are more then expected
  const maxScore = calculateMaxScoreForYears(expectedRecentRelevantYears);
  // normalize to percentages and cap to 100 if bigger
  const overallScore = Math.min((score / maxScore) * 100, 100);

  return {
    normalizedActivityList:
      order === "asc"
        ? normalizedActivityList
        : normalizedActivityList.reverse(),
    hintList: order === "asc" ? hintList : hintList.reverse(),
    pillsCaption,
    techNames,
    activeMonthsAndYears,
    overallScore,
    maxScore,
    color: getScoreColor(overallScore),
  };
};

export const useTechFocusActivity = ({
  candidateScopes,
  scopeCodes,
  expectedRecentRelevantYears,
  order,
}: UseTechFocusActivityParams): UseTechFocusActivityResults => {
  const results: UseTechFocusActivityResults =
    {} as UseTechFocusActivityResults;

  for (const scopeCode of scopeCodes) {
    results[scopeCode] = processCandidateScope({
      candidateScope: candidateScopes[scopeCode],
      expectedRecentRelevantYears,
      order,
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

const getScoreColor = (score: number): TTechFocusActivity["color"] => {
  if (score >= 85) return "success";
  if (score >= 65) return "primary";
  if (score >= 45) return "warning";
  if (score >= 25) return "neutral";
  return "danger";
};
