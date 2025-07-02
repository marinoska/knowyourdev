import {
  ResumeTechProfileJobEntry,
  ResumeTechProfileResponse,
  GapEntry,
} from "@kyd/common";
import { GAP_JOB, GAP_ROLE, Range, mergeRanges } from "@kyd/common";
import { addDays, differenceInMonths } from "date-fns";

/**
 * Calculate gaps between jobs
 * @param jobs Array of jobs with start and end dates
 * @returns Array of job gaps with start, end, and months properties
 */
export function calculateJobGaps(
  jobs: ResumeTechProfileJobEntry[],
): GapEntry[] {
  if (!jobs || !jobs.length) return [];
  const gapsRanges = getJobGaps(jobs);

  return [
    ...gapsRanges.map((range) => ({
      role: GAP_ROLE,
      job: GAP_JOB,
      start: range.start,
      end: range.end,
      months: range.months,
      popularity: 0 as const,
    })),
  ];
}

export function getJobGaps(
  jobs: ResumeTechProfileJobEntry[],
): (Range & { months: number })[] {
  const sortedJobs = jobs.sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );
  const mergedAndSorted = mergeRanges(
    sortedJobs.map((job) => ({
      start: job.start,
      end: job.end,
    })),
  );

  if (mergedAndSorted.length) {
    const today = new Date();
    if (mergedAndSorted[mergedAndSorted.length - 1].end < today) {
      mergedAndSorted.push({ start: today, end: today });
    }
  }
  const gaps: (Range & { months: number })[] = [];
  mergedAndSorted.forEach((range, index) => {
    if (index === 0) return;

    const prevEnd = mergedAndSorted[index - 1].end;
    const currentStart = range.start;
    const months = differenceInMonths(currentStart, prevEnd);

    if (months > 0) {
      gaps.push({
        start: addDays(prevEnd, 1),
        end: addDays(currentStart, -1),
        months,
      });
    }
  });

  return gaps;
}

/**
 * Add job gaps to the tech profile response
 * @param techProfile The tech profile response
 * @returns The tech profile response with job gaps added
 */
export function addJobGapsToResponse(
  techProfile: ResumeTechProfileResponse,
): ResumeTechProfileResponse {
  const jobGaps = calculateJobGaps(techProfile.jobs);
  return {
    ...techProfile,
    jobGaps,
  };
}
