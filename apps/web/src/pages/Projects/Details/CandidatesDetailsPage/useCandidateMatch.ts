import {
  ResumeTechProfileTechnologiesEntry,
  ActivityPeriod,
  ScopeType,
  TTechFocusTimeline,
  TTechTimeline,
} from "@kyd/common/api";
import { TProject, TResumeProfile } from "@/api/query/types.ts";
import { sortRangesAsc } from "@kyd/common";

type UseCandidateMatchParams = {
  project?: TProject;
  profile?: TResumeProfile;
};

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

export type TCandidateTechFocusMatch = {
  techFocusMatch: Record<ScopeType, TTechFocusMatch>;
  techFocusAvgScore: number;
  techMatch: Record<string, TTechMatch>;
  techMatchAvgScore: number;
  overallMatch: number;
  averageJobDuration: number;
  baselineJobDuration: number;
  jobStabilityScore: number;
};

const MAX_SCORED_YEARS = 10;

type ProcessCandidateScopeInput = {
  candidateScope: TTechFocusTimeline;
  expectedRecentRelevantYears: number;
};

const processCandidateScope = ({
  candidateScope = { periods: [], years: [] },
  expectedRecentRelevantYears,
}: ProcessCandidateScopeInput): TTechFocusMatch => {
  // Ensure dates are properly converted to Date objects
  const periodsWithDates =
    candidateScope?.periods?.map((period) => ({
      ...period,
      start: new Date(period.start),
      end: new Date(period.end),
    })) || [];

  const sortedPeriods = sortRangesAsc(periodsWithDates);

  const lastPeriods = sortedPeriods.slice(0, MAX_SCORED_YEARS) || [];

  const descNormalizedActivityScoreList = lastPeriods.map(
    ({ totalMonths }: { totalMonths: number }) => (totalMonths * 100) / 12,
  );

  const totalActiveMonth = lastPeriods
    .map((period: ActivityPeriod) => period.totalMonths)
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

const restructureProfileTechnologies = (
  profileTechnologies: ResumeTechProfileTechnologiesEntry[],
): Record<string, ResumeTechProfileTechnologiesEntry> => {
  const techMap: Record<string, ResumeTechProfileTechnologiesEntry> = {};
  profileTechnologies.forEach((tech) => {
    techMap[tech.code] = tech;
  });

  return techMap;
};

/**
 * Calculate technology match score
 */
const calculateTechMatch = (
  profileTech: ResumeTechProfileTechnologiesEntry,
  expectedRecentRelevantYears: number,
  techTimeline?: TTechTimeline,
): TTechMatch => {
  // Convert tech jobs to periods format similar to scopes
  const periods: ActivityPeriod[] = profileTech.jobs.map((job) => ({
    start: job.start,
    end: job.end,
    totalMonths: Math.floor(
      (job.end.getTime() - job.start.getTime()) / (1000 * 60 * 60 * 24 * 30),
    ),
    technologies: [],
  }));

  const sortedPeriods = sortRangesAsc(periods);

  // Calculate score using the same logic as for scopes
  const { score } = calculateTechFocusScore(sortedPeriods);
  const maxScore = calculateMaxScoreForYears(expectedRecentRelevantYears);
  const overallScore = Math.min((score / maxScore) * 100, 100);

  // Use tech activity data if available, otherwise use calculated periods
  // Ensure dates are properly converted to Date objects
  const descActivityPeriods = techTimeline?.periods
    ? techTimeline.periods.map((period) => ({
        ...period,
        start: new Date(period.start),
        end: new Date(period.end),
      }))
    : sortedPeriods;
  const lastPeriods = descActivityPeriods.slice(0, MAX_SCORED_YEARS) || [];

  const descNormalizedActivityScoreList = lastPeriods.map(
    ({ totalMonths }: { totalMonths: number }) => (totalMonths * 100) / 12,
  );

  const totalActiveMonth = lastPeriods
    .map((period: ActivityPeriod) => period.totalMonths)
    .reduce((acc: number, val: number) => acc + val, 0);

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
      techMatch: {} as Record<string, TTechMatch>,
      techMatchAvgScore: 0,
      overallMatch: 0,
      averageJobDuration: 0,
      baselineJobDuration: 0,
      jobStabilityScore: 0,
    };
  }

  const {
    scopes: candidateScopes,
    averageJobDuration,
    technologies: profileTechnologies,
    techUsage,
  } = profile;
  const {
    techFocus: expectedScopes,
    expectedRecentRelevantYears,
    baselineJobDuration,
    technologies: projectTechnologies,
  } = project.settings;

  // Process scope matches
  const techFocusMatch = {} as Record<ScopeType, TTechFocusMatch>;
  let techFocusAvgScore = 0;

  for (const scopeCode of expectedScopes) {
    techFocusMatch[scopeCode] = processCandidateScope({
      candidateScope: candidateScopes[scopeCode],
      expectedRecentRelevantYears,
    });
    techFocusAvgScore += techFocusMatch[scopeCode].overallScore;
  }
  techFocusAvgScore = techFocusAvgScore / expectedScopes.length || 0;

  // Process technology matches
  const keyProfileTechnologies =
    restructureProfileTechnologies(profileTechnologies);
  const techMatch = {} as Record<string, TTechMatch>;
  let techMatchAvgScore = 0;
  let techMatchCount = 0;

  for (const projectTech of projectTechnologies) {
    const profileTech = keyProfileTechnologies[projectTech.code];
    if (profileTech) {
      // Get tech activity data if available
      const techActivity = techUsage?.[projectTech.code];

      techMatch[projectTech.code] = calculateTechMatch(
        profileTech,
        expectedRecentRelevantYears,
        techActivity,
      );
      techMatchAvgScore += techMatch[projectTech.code].overallScore;
      techMatchCount++;
    } else {
      techMatch[projectTech.code] = {
        overallScore: 0,
        maxScore: 0,
        descNormalizedActivityScoreList: [],
        descActivityPeriods: [],
        totalActiveMonths: 0,
      };
    }
  }
  techMatchAvgScore =
    techMatchCount > 0 ? techMatchAvgScore / techMatchCount : 0;

  // Calculate overall match as average of scope and tech matches
  const overallMatch = (techFocusAvgScore + techMatchAvgScore) / 2;

  const jobStabilityScore = Math.min(
    (averageJobDuration / baselineJobDuration) * 100,
    100,
  );

  return {
    techFocusMatch,
    techFocusAvgScore,
    techMatch,
    techMatchAvgScore,
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
  periods: ActivityPeriod[],
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
