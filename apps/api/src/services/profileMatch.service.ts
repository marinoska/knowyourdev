import {
  ActivityPeriod,
  ScopeType,
  TProject,
  TResumeProfileMetrics,
  TResumeTechProfileDTO,
  TTechFocusTimeline,
  TTechTimeline,
} from "@kyd/common/api";
import { sortRangesDesc } from "@kyd/common";

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

const MAX_SCORED_YEARS = 10;

/**
 * Service for calculating match to a provided project of a resume profile
 */
export class ProfileMatchService {
  getCandidateMatch({
    project,
    candidate,
  }: {
    project?: TProject;
    candidate?: TResumeTechProfileDTO & TResumeProfileMetrics;
  }): TCandidateMatch {
    if (!project || !candidate) {
      return DefaultCandidateMatch;
    }

    return candidateMatch({ project, candidate });
  }

  getCandidateListMatch({
    project,
    candidates,
  }: {
    project?: TProject;
    candidates?: (TResumeTechProfileDTO & TResumeProfileMetrics)[];
  }) {
    if (!project || !candidates) {
      return [DefaultCandidateMatch];
    }

    return candidates.map((candidate) => ({
      uploadId: candidate.uploadId,
      overallMatch: candidateMatch({ project, candidate }).overallMatch,
    }));
  }
}

const calculateCandidateTechScore = ({
  candidateTimeline = { periods: [], years: [] },
  expectedRecentRelevantYears,
}: {
  candidateTimeline: TTechFocusTimeline | TTechTimeline;
  expectedRecentRelevantYears: number;
}): TTechFocusMatch => {
  const sortedPeriods = sortRangesDesc(candidateTimeline.periods);

  const lastPeriods = sortedPeriods.slice(0, MAX_SCORED_YEARS) || [];

  const descNormalizedActivityScoreList = lastPeriods.map(
    ({ totalMonths }) => (totalMonths * 100) / 12,
  );

  const totalActiveMonth = lastPeriods
    .map((period: ActivityPeriod) => period.totalMonths)
    .reduce((acc: number, val: number) => acc + val, 0);

  // score for all periods
  const { score } = calculateTechScore(lastPeriods);
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

function candidateMatch({
  project,
  candidate,
}: {
  project: TProject;
  candidate: TResumeTechProfileDTO & TResumeProfileMetrics;
}): TCandidateMatch {
  // Process scope matches
  const techFocusMatch = {} as Record<ScopeType, TTechFocusMatch>;
  let techFocusAvgScore = 0;

  for (const scopeCode of project.settings.techFocus) {
    techFocusMatch[scopeCode] = calculateCandidateTechScore({
      candidateTimeline: candidate.techFocusUsage[scopeCode],
      expectedRecentRelevantYears: project.settings.expectedRecentRelevantYears,
    });
    techFocusAvgScore += techFocusMatch[scopeCode].overallScore;
  }
  techFocusAvgScore =
    techFocusAvgScore / project.settings.techFocus.length || 0;

  const techMatch = {} as Record<string, TTechMatch>;
  let techAvgScore = 0;

  for (const projectTech of project.settings.technologies) {
    techMatch[projectTech.code] = calculateCandidateTechScore({
      candidateTimeline: candidate.techUsage[projectTech.code],
      expectedRecentRelevantYears: project.settings.expectedRecentRelevantYears,
    });
    techAvgScore += techMatch[projectTech.code].overallScore;
  }
  techAvgScore = techAvgScore / project.settings.technologies.length || 0;

  // Calculate overall match as average of scope and tech matches
  const overallMatch = (techFocusAvgScore + techAvgScore) / 2;

  const jobStabilityScore = Math.min(
    (candidate.averageJobDuration / project.settings.baselineJobDuration) * 100,
    100,
  );

  return {
    techFocusMatch,
    techFocusAvgScore,
    techMatch,
    techAvgScore,
    overallMatch,
    averageJobDuration: candidate.averageJobDuration,
    baselineJobDuration: project.settings.baselineJobDuration,
    jobStabilityScore,
  };
}

const DefaultCandidateMatch = {
  techFocusMatch: {} as Record<ScopeType, TTechFocusMatch>,
  techFocusAvgScore: 0,
  techMatch: {} as Record<string, TTechMatch>,
  techAvgScore: 0,
  overallMatch: 0,
  averageJobDuration: 0,
  baselineJobDuration: 0,
  jobStabilityScore: 0,
};

/**
 * Calculate recency-weighted score and max score for a given tech.
 */
const calculateTechScore = (
  periods: ActivityPeriod[],
): { score: number; maxScore: number } => {
  let score = 0;
  let maxScore = 0;

  periods.forEach((period, index) => {
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
