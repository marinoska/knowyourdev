import { ScopeType, TCandidateMatch, ActivityPeriod, TTechTimeline } from "@kyd/common/api";
import type { TProjectDTO, TResumeProfileDTO } from "@/api/query/types.ts";
import type { TTechFocusUsage } from "@kyd/common/api";

// Types present on transformed resume profile

type CandidateWithTimelines = TResumeProfileDTO & {
  techFocusUsage: TTechFocusUsage;
  techUsage: Record<string, TTechTimeline>;
  averageJobDuration: number;
};

type TTechFocusMatch = {
  descNormalizedActivityScoreList: number[];
  descActivityPeriods: ActivityPeriod[];
  totalActiveMonths: number;
  overallScore: number;
  maxScore: number;
};

type TTechMatch = TTechFocusMatch;

const MAX_SCORED_YEARS = 10;

const calculateTechScore = (
  periods: ActivityPeriod[],
): { score: number; maxScore: number } => {
  let score = 0;
  let maxScore = 0;

  periods.forEach((period, index) => {
    const weight = 1 - index * 0.1;
    score += period.totalMonths * weight;
    maxScore += 12 * weight;
  });

  return { score, maxScore };
};

const calculateMaxScoreForYears = (years: number) => {
  let maxScore = 0;
  for (let index = 0; index < years; index++) {
    const weight = 1 - index * 0.1;
    maxScore += 12 * weight;
  }
  return maxScore;
};

const sortRangesDesc = (periods: ActivityPeriod[]) => {
  // Transformer already sorts by recency; return as-is to avoid coupling.
  return periods || [];
};

const calculateCandidateTechScore = ({
  candidateTimeline = { periods: [], years: [] },
  expectedRecentRelevantYears,
}: {
  candidateTimeline: TTechTimeline;
  expectedRecentRelevantYears: number;
}): TTechFocusMatch => {
  const sortedPeriods = sortRangesDesc(candidateTimeline.periods);
  const lastPeriods = sortedPeriods.slice(0, MAX_SCORED_YEARS) || [];

  const descNormalizedActivityScoreList = lastPeriods.map(
    ({ totalMonths }) => (totalMonths * 100) / 12,
  );

  const totalActiveMonths = lastPeriods
    .map((p) => p.totalMonths)
    .reduce((acc, val) => acc + val, 0);

  const { score } = calculateTechScore(lastPeriods);
  const maxScore = calculateMaxScoreForYears(expectedRecentRelevantYears);
  const overallScore = Math.min((score / maxScore) * 100, 100);

  return {
    descNormalizedActivityScoreList,
    descActivityPeriods: lastPeriods,
    totalActiveMonths,
    overallScore,
    maxScore,
  };
};

export function computeCandidateMatch(
  project: TProjectDTO,
  candidate: CandidateWithTimelines,
): TCandidateMatch {
  const techFocusMatch = {} as Record<ScopeType, TTechFocusMatch>;
  let techFocusAvgScore = 0;

  for (const scopeCode of project.settings.techFocus) {
    const score = calculateCandidateTechScore({
      candidateTimeline: candidate.techFocusUsage[scopeCode] || {
        periods: [],
        years: [],
      },
      expectedRecentRelevantYears: project.settings.expectedRecentRelevantYears,
    });
    techFocusMatch[scopeCode] = score;
    techFocusAvgScore += score.overallScore;
  }
  techFocusAvgScore =
    techFocusAvgScore / (project.settings.techFocus.length || 1);

  const techMatch = {} as Record<string, TTechMatch>;
  let techAvgScore = 0;
  for (const projectTech of project.settings.technologies) {
    const score = calculateCandidateTechScore({
      candidateTimeline: candidate.techUsage[projectTech.code] || {
        periods: [],
        years: [],
      },
      expectedRecentRelevantYears: project.settings.expectedRecentRelevantYears,
    });
    techMatch[projectTech.code] = score;
    techAvgScore += score.overallScore;
  }
  techAvgScore =
    techAvgScore / (project.settings.technologies.length || 1);

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
