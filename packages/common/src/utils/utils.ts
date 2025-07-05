import { differenceInMonths } from "date-fns";

export type Range = {
  start: Date;
  end: Date;
};

export const sortRangesAsc = <T extends Range>(ranges: T[]) =>
  [...ranges].sort((a, b) => a.start.getTime() - b.start.getTime());

export function mergeRanges<T extends Range>(inputRanges: T[]): Range[] {
  if (!inputRanges.length) {
    return [];
  }
  const ranges = sortRangesAsc(inputRanges);
  // ranges.sort((a, b) => a.start.getTime() - b.start.getTime());

  const merged = [ranges[0]]; // Initialize with the first range

  for (let i = 1; i < ranges.length; i++) {
    const lastRange = merged[merged.length - 1];
    const currentRange = ranges[i];

    if (currentRange.start <= lastRange.end) {
      // If ranges overlap, merge them by extending the lastRange's end
      lastRange.end = new Date(
        Math.max(lastRange.end.getTime(), currentRange.end.getTime()),
      );
    } else {
      // If no overlap, add the current range to the merged array
      merged.push(currentRange);
    }
  }

  return merged;
}

// returns months total
export function sumRanges(ranges: Range[]): number {
  const mergedRanges = mergeRanges(ranges);
  return mergedRanges.reduce<number>((acc, { start, end }) => {
    return acc + differenceInMonths(end, start);
  }, 0);
}
