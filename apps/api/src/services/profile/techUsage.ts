import {
  TResumeProfileCategories,
  ResumeTechProfileTechnologiesEntry,
  TResumeProfileTechUsage,
  TTechUsage,
  TTechTimeline,
} from "@kyd/common/api";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TResumeTechProfileDocument } from "@/models/resumeTechProfileModel.js";
import { loopThroughMonths } from "@/services/profile/helpers.js";

/**
 * Calculate tech activities for a tech profile
 * @param techProfile The tech profile response
 * @param earliestJobStart The earliest job start date
 * @returns Object containing tech activities data
 */
export function calculateTechActivities(
  techProfile: Pick<TResumeTechProfileDocument, "technologies" | "createdAt"> &
    Pick<TResumeProfileCategories, "earliestJobStart">,
): TTechUsage {
  const result = {} as TTechUsage;
  if (!techProfile.technologies) {
    return result;
  }

  const uploadDate = startOfMonth(new Date(techProfile.createdAt));

  for (const tech of techProfile.technologies) {
    if (!tech.code) continue;

    if (!result[tech.code]) {
      result[tech.code] = {
        periods: [],
        years: {},
      };
    }

    for (const job of tech.jobs) {
      loopThroughMonths(job.start, job.end).map(({ year, month }) => {
        // create bit matrix (year, month) where we mark 1 on intersections.
        result[tech.code].years[year]
          ? (result[tech.code].years[year][month - 1] = 1)
          : (result[tech.code].years[year] = Array(12).fill(0));
      });
    }
  }

  // Calculate 12-month periods from upload date
  for (const techCode of Object.keys(result)) {
    const techData = result[techCode];

    // Create periods (12-month chunks) going back from upload date to earliest job start
    let periodEnd = endOfMonth(subMonths(new Date(uploadDate), 1));
    let periodStart = startOfMonth(subMonths(periodEnd, 11));

    // Keep creating periods until we reach or go past the earliest job start date
    do {
      addPeriod(
        techData,
        periodStart,
        periodEnd,
        techCode,
        techProfile.technologies,
      );
      periodStart = subMonths(periodStart, 12);
      periodEnd = subMonths(periodEnd, 12);
    } while (periodStart >= techProfile.earliestJobStart);

    // Sort periods from the last backwards (most recent first)
    techData.periods.sort((a, b) => b.end.getTime() - a.end.getTime());
  }

  return result;
}

/**
 * Add tech activities to the tech profile response
 * @param techProfile The tech profile response with job categories
 * @returns The tech activities
 */
export function getProfileTechUsage(
  techProfile: Pick<TResumeTechProfileDocument, "technologies" | "createdAt"> &
    Pick<TResumeProfileCategories, "earliestJobStart">,
): TResumeProfileTechUsage {
  if (!techProfile.earliestJobStart) {
    return { techUsage: {} as TTechUsage };
  }

  const techUsage = calculateTechActivities(techProfile);
  return { techUsage };
}

// Helper function to add a period with filtered technologies
function addPeriod(
  techData: TTechTimeline,
  periodStart: Date,
  periodEnd: Date,
  techCode: string,
  technologies: ResumeTechProfileTechnologiesEntry[],
) {
  techData.periods.push({
    start: periodStart,
    end: periodEnd,
    totalMonths: loopThroughMonths(periodStart, periodEnd).reduce(
      (acc, { year, month }) => {
        acc += techData.years[year]?.[month - 1] || 0;
        return acc;
      },
      0,
    ),
    technologies: technologies
      .filter((tech) => tech.code === techCode)
      .map((tech) => ({
        name: tech.name,
        totalMonths: tech.totalMonths || 0,
      })),
  });
}
