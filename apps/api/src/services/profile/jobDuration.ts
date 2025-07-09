import {
  ResumeProfileJobEntry,
  TResumeProfileJobDuration,
} from "@kyd/common/api";
import { TResumeProfileDocument } from "@/models/resumeProfileModel.js";

/**
 * Calculate average duration of jobs
 * @param jobs Array of jobs with start and end dates
 * @returns Average duration of jobs in months
 */
export function calculateAverageJobDuration(
  jobs: ResumeProfileJobEntry[],
): number {
  if (!jobs || !jobs.length) return 0;

  const totalDuration = jobs.reduce((sum, job) => {
    return sum + job.months;
  }, 0);

  return Math.round(totalDuration / jobs.length);
}

/**
 * Add average job duration to the tech profile response
 * @param profile The tech profile response
 * @returns The tech profile response with average job duration added
 */
export function getProfileJobDuration(
  profile: TResumeProfileDocument,
): TResumeProfileJobDuration {
  return {
    averageJobDuration: calculateAverageJobDuration(profile.jobs),
  };
}
