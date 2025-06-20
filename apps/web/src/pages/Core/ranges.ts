import {
  addDays,
  differenceInMonths,
  endOfMonth,
  startOfMonth,
} from "date-fns";
import { Job } from "@/api/query/types.ts";
import { mergeRanges, Range } from "@kyd/common";

export function getJobGaps(jobs: Job[]): (Range & { months: number })[] {
  const mergedAndSorted = mergeRanges(
    jobs.map((job) => ({
      start: startOfMonth(job.start),
      end: endOfMonth(job.end),
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
