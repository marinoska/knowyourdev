import {
  ResumeProfileJobEntry,
  GapEntry,
  TResumeProfileGaps,
} from "@kyd/common/api";
import {
  GAP_JOB,
  GAP_ROLE,
  Range,
  mergeRanges,
  sortRangesAsc,
} from "@kyd/common";
import { addDays, differenceInMonths } from "date-fns";
import { TResumeProfileDocument } from "@/models/resumeProfileModel.js";

/**
 * Calculate gaps between jobs
 * @param jobs Array of jobs with start and end dates
 * @returns Array of job gaps with start, end, and months properties
 */
export function calculateJobGaps(jobs: ResumeProfileJobEntry[]): GapEntry[] {
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
  jobs: ResumeProfileJobEntry[],
): (Range & { months: number })[] {
  const sortedJobs = sortRangesAsc(jobs);
  const mergedAndSorted = mergeRanges(
    sortedJobs.map((job: ResumeProfileJobEntry) => ({
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
export function getProfileJobGaps(
  techProfile: TResumeProfileDocument,
): TResumeProfileGaps {
  return { jobGaps: calculateJobGaps(techProfile.jobs) };
}
