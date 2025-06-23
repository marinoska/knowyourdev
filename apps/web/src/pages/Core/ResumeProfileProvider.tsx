import { ReactNode, useMemo } from "react";
import { Job, ProcessedUploadProfile, TechProfile } from "@/api/query/types.ts";
import { getJobGaps } from "@/pages/Core/ranges.ts";
import { GAP_JOB, GAP_ROLE, sumRanges } from "@kyd/common";
import { ScopeType } from "@kyd/common/api";
import {
  ResumeProfileContext,
  Gap,
  TScopeActivity,
  TScopes,
} from "./ResumeProfileContext.ts";
import {
  addMonths,
  differenceInMonths,
  endOfMonth,
  getMonth,
  getYear,
  startOfMonth,
  subMonths,
} from "date-fns";

export function ResumeProfileProvider({
  children,
  profile,
}: {
  children: ReactNode;
  profile?: ProcessedUploadProfile;
}) {
  const jobGaps = useMemo<Gap[]>(() => {
    if (!profile?.jobs) {
      return [];
    }

    const sortedJobs = profile.jobs.sort(
      (a, b) => a.start.getTime() - b.start.getTime(),
    );
    const gapsRanges = getJobGaps(sortedJobs);

    return [
      ...gapsRanges.map((range) => ({
        role: GAP_ROLE,
        job: GAP_JOB,
        start: range.start,
        end: range.end,
        months: range.months,
        popularity: 0,
      })),
    ];
  }, [profile?.jobs]);

  const [
    softwareDevelopmentJobs,
    irrelevantJobs,
    jobsWithMissingTech,
    jobsWithFilledTech,
    earliestJobStart,
  ] = useMemo(() => {
    const devJobs: Job[] = [];
    const otherJobs: Job[] = [];
    const jobsWithMissingTech: Job[] = [];
    const jobsWithFilledTech: Job[] = [];

    const sortedJobs = profile?.jobs.sort(
      (a, b) => a.start.getTime() - b.start.getTime(),
    );

    const earliestJobStart = sortedJobs?.length
      ? new Date(sortedJobs[0].start)
      : new Date();

    for (const job of sortedJobs || []) {
      if (job.isSoftwareDevelopmentRole) {
        devJobs.push(job);
        if (!job.technologies.length) {
          jobsWithMissingTech.push(job);
        } else {
          jobsWithFilledTech.push(job);
        }
      } else {
        otherJobs.push(job);
      }
    }

    return [
      devJobs,
      otherJobs,
      jobsWithMissingTech,
      jobsWithFilledTech,
      earliestJobStart,
    ];
  }, [profile?.jobs]);

  const scopes = useMemo<TScopes>(() => {
    const result = {} as TScopes;
    if (!profile?.technologies) {
      return result;
    }
    const uploadDate = startOfMonth(new Date(profile.createdAt));

    const scopeTechnologies = {} as Record<ScopeType, TechProfile[]>;

    for (const tech of profile.technologies) {
      if (!tech.scope) continue;

      if (!result[tech.scope]) {
        result[tech.scope] = {
          periods: [],
          years: {},
        };
        scopeTechnologies[tech.scope] = [];
      }

      for (const job of tech.jobs) {
        loopThroughMonths(job.start, job.end).map(({ year, month }) => {
          // create bit matrix (year, month) where we mark 1 on intersections.
          result[tech.scope].years[year]
            ? (result[tech.scope].years[year][month - 1] = 1)
            : (result[tech.scope].years[year] = Array(12).fill(0));
        });
      }
      scopeTechnologies[tech.scope].push(tech);
    }

    // Calculate 12-month periods from upload date
    for (const scopeKey of Object.keys(result)) {
      const scope = scopeKey as ScopeType;
      const scopeData = result[scope];

      // Create periods (12-month chunks) going back from upload date to earliest job start
      let periodEnd = endOfMonth(subMonths(new Date(uploadDate), 1));
      let periodStart = startOfMonth(subMonths(periodEnd, 11));
      // Create multiple periods from upload date back to earliest job start

      // Keep creating periods until we reach or go past the earliest job start date
      do {
        addPeriod(scopeData, periodStart, periodEnd, scopeTechnologies[scope]);
        console.log({
          periodEnd: periodEnd.toDateString(),
          periodStart: periodStart.toDateString(),
        });
        periodStart = subMonths(periodStart, 12);
        periodEnd = subMonths(periodEnd, 12);
      } while (periodStart >= earliestJobStart);

      // Sort periods from the last backwards (most recent first)
      scopeData.periods.sort(
        (a, b) => b.endDate.getTime() - a.endDate.getTime(),
      );
    }

    return result;
  }, [profile?.technologies, profile?.createdAt, earliestJobStart]);

  const context = useMemo(
    () => ({
      profile,
      jobGaps,
      softwareDevelopmentJobs,
      irrelevantJobs,
      jobsWithMissingTech,
      jobsWithFilledTech,
      monthsActive: sumRanges(softwareDevelopmentJobs),
      scopes,
      earliestJobStart,
    }),
    [
      profile,
      jobGaps,
      irrelevantJobs,
      softwareDevelopmentJobs,
      jobsWithMissingTech,
      jobsWithFilledTech,
      scopes,
      earliestJobStart,
    ],
  );

  return (
    <ResumeProfileContext.Provider value={context}>
      {children}
    </ResumeProfileContext.Provider>
  );
}

// Helper function to add a period with filtered technologies
function addPeriod(
  scopeData: TScopeActivity,
  periodStart: Date,
  periodEnd: Date,
  technologies: TechProfile[],
) {
  scopeData.periods.push({
    startDate: periodStart,
    endDate: periodEnd,
    totalMonths: loopThroughMonths(periodStart, periodEnd).reduce(
      (acc, { year, month }) => {
        acc += scopeData.years[year]?.[month - 1] || 0;
        return acc;
      },
      0,
    ),
    technologies: technologies.filter((tech) => {
      // Check if technology was used in this period
      return tech.jobs.some((job) => {
        const jobStart = job.start ? new Date(job.start) : null;
        const jobEnd = job.end ? new Date(job.end) : new Date();

        // Check if job overlaps with period
        return (!jobStart || jobStart <= periodEnd) && jobEnd >= periodStart;
      });
    }),
  });
}

const loopThroughMonths = (
  start: Date,
  end: Date,
): { year: number; month: number }[] => {
  const totalMonths = differenceInMonths(end, start);

  const result: { year: number; month: number }[] = []; // Array to store the result
  let currentDate = startOfMonth(start); // Start at the first day of the start month

  for (let i = 0; i <= totalMonths; i++) {
    result.push({
      year: getYear(currentDate), // Get the year
      month: getMonth(currentDate) + 1, // Get the month (add 1 because getMonth is 0-based)
    });

    currentDate = addMonths(currentDate, 1); // Move to the next month
  }

  return result;
};
