import {
  ActivityPeriod,
  ResumeProfileTechnologiesEntry,
  TCandidateMatch,
  TTechFocusMatch,
  TTechMatch,
} from "@kyd/common/api";

/**
 * Converts a string, number, or Date to a Date object
 * @param date - The date to convert
 * @returns A Date object
 */
export const toDateSafe = (date?: string | number | Date) =>
  date ? new Date(date) : new Date();

/**
 * Converts start and end date strings to Date objects in an array of items
 * @param items - Array of objects with start and end properties
 * @returns Array with start and end converted to Date objects
 */
export const rangeToDateSafe = <
  T extends { start: string | Date; end: string | Date },
>(
  items: T[],
) =>
  items.map(({ start, end, ...rest }) => ({
    ...rest,
    start: start instanceof Date ? start : new Date(start),
    end: end instanceof Date ? end : new Date(end),
  }));

/**
 * Transforms technologies data by ensuring totalMonths is set and converting job dates
 * @param technologies - Array of technology entries
 * @returns Transformed technologies array
 */
export const transformTechnologies = (
  technologies: ResumeProfileTechnologiesEntry[],
) =>
  technologies.map((tech) => ({
    ...tech,
    totalMonths: tech.totalMonths || 0,
    jobs: rangeToDateSafe(tech.jobs),
  }));

/**
 * Transforms activity entries by converting date ranges in periods
 * @param data - Record of activity entries
 * @param fieldName - Name of the field containing periods
 * @returns Transformed activity entries
 */
export const transformActivityEntries = <
  T extends {
    periods?: ActivityPeriod[];
    descActivityPeriods?: ActivityPeriod[];
  },
>(
  data: Record<string, T>,
  fieldName: "periods" | "descActivityPeriods",
) =>
  Object.entries(data).reduce(
    (acc, [key, value]) => {
      const entriesWithPeriods = value[fieldName] || [];

      acc[key] = {
        ...value,
        [fieldName]: rangeToDateSafe(entriesWithPeriods),
      };

      return acc;
    },
    {} as Record<string, T>,
  );

/**
 * Transforms match data by converting date ranges in tech and tech focus matches
 * @param match - Candidate match data
 * @returns Transformed match data
 */
export const transformMatch = (match: TCandidateMatch) => ({
  ...match,
  techMatch: transformActivityEntries(
    match.techMatch,
    "descActivityPeriods",
  ) as Record<string, TTechMatch>,
  techFocusMatch: transformActivityEntries(
    match.techFocusMatch,
    "descActivityPeriods",
  ) as Record<string, TTechFocusMatch>,
});
