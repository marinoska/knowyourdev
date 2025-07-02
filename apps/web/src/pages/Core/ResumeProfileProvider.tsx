import { ReactNode, useMemo } from "react";
import { ProcessedUploadProfile, TechProfile } from "@/api/query/types.ts";
import { sumRanges } from "@kyd/common";
import { ScopeType } from "@kyd/common/api";
import {
  ResumeProfileContext,
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

      // Keep creating periods until we reach or go past the earliest job start date
      do {
        addPeriod(scopeData, periodStart, periodEnd, scopeTechnologies[scope]);
        periodStart = subMonths(periodStart, 12);
        periodEnd = subMonths(periodEnd, 12);
      } while (periodStart >= profile?.earliestJobStart);

      // Sort periods from the last backwards (most recent first)
      scopeData.periods.sort(
        (a, b) => b.endDate.getTime() - a.endDate.getTime(),
      );
    }

    return result;
  }, [profile]);

  const context = useMemo(
    () => ({
      profile,
      jobGaps: profile?.jobGaps || [],
      softwareDevelopmentJobs: profile?.softwareDevelopmentJobs || [],
      irrelevantJobs: profile?.irrelevantJobs || [],
      jobsWithMissingTech: profile?.jobsWithMissingTech || [],
      jobsWithFilledTech: profile?.jobsWithFilledTech || [],
      earliestJobStart: profile?.earliestJobStart
        ? new Date(profile.earliestJobStart)
        : null,
      monthsActive: sumRanges(profile?.softwareDevelopmentJobs || []),
      scopes,
    }),
    [profile, scopes],
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
