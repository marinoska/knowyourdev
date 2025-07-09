import {
  TResumeProfileCategories,
  ResumeTechProfileTechnologiesEntry,
  ScopeType,
  TTechFocusTimeline,
  TTechFocusUsage,
  TResumeProfileTechFocusUsage,
} from "@kyd/common/api";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TResumeProfileDocument } from "@/models/resumeProfileModel.js";
import { loopThroughMonths } from "@/services/profile/helpers.js";

/**
 * Calculate scopes for a tech profile
 * @param techProfile The tech profile response
 * @param earliestJobStart The earliest job start date
 * @returns Object containing scopes data
 */
export function calculateScopes(
  techProfile: Pick<TResumeProfileDocument, "technologies" | "createdAt"> &
    Pick<TResumeProfileCategories, "earliestJobStart">,
  earliestJobStart: Date,
): TTechFocusUsage {
  const result = {} as TTechFocusUsage;
  if (!techProfile.technologies) {
    return result;
  }

  const uploadDate = startOfMonth(new Date(techProfile.createdAt));
  const scopeTechnologies = {} as Record<
    ScopeType,
    ResumeTechProfileTechnologiesEntry[]
  >;

  for (const tech of techProfile.technologies) {
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
    } while (periodStart >= earliestJobStart);

    // Sort periods from the last backwards (most recent first)
    scopeData.periods.sort((a, b) => b.end.getTime() - a.end.getTime());
  }

  return result;
}

/**
 * Add scopes to the tech profile response
 * @param techProfile The tech profile response with job categories
 * @returns The scopes
 */
export function getProfileTechFocusUsage(
  techProfile: Pick<TResumeProfileDocument, "technologies" | "createdAt"> &
    Pick<TResumeProfileCategories, "earliestJobStart">,
): TResumeProfileTechFocusUsage {
  if (!techProfile.earliestJobStart) {
    return { techFocusUsage: {} as TTechFocusUsage };
  }

  const scopes = calculateScopes(techProfile, techProfile.earliestJobStart);
  return { techFocusUsage: scopes };
}

// Helper function to add a period with filtered technologies
function addPeriod(
  scopeData: TTechFocusTimeline,
  periodStart: Date,
  periodEnd: Date,
  technologies: ResumeTechProfileTechnologiesEntry[],
) {
  scopeData.periods.push({
    start: periodStart,
    end: periodEnd,
    totalMonths: loopThroughMonths(periodStart, periodEnd).reduce(
      (acc, { year, month }) => {
        acc += scopeData.years[year]?.[month - 1] || 0;
        return acc;
      },
      0,
    ),
    technologies: technologies
      .map((tech) => ({
        name: tech.name,
        totalMonths: tech.totalMonths || 0,
      }))
      .filter((tech) => {
        // Check if technology was used in this period
        return technologies.some((originalTech) => {
          return (
            originalTech.name === tech.name &&
            originalTech.jobs.some((job) => {
              // Check if job overlaps with period
              return (
                (!job.start || job.start <= periodEnd) && job.end >= periodStart
              );
            })
          );
        });
      }),
  });
}
