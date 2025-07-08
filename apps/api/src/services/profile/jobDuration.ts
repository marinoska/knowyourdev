import {
  ResumeTechProfileJobEntry,
  TResumeProfileJobDuration,
} from "@kyd/common/api";
import { TResumeTechProfileDocument } from "@/models/resumeTechProfileModel.js";

/**
 * Calculate average duration of jobs
 * @param jobs Array of jobs with start and end dates
 * @returns Average duration of jobs in months
 */
export function calculateAverageJobDuration(
  jobs: ResumeTechProfileJobEntry[],
): number {
  if (!jobs || !jobs.length) return 0;

  const totalDuration = jobs.reduce((sum, job) => {
    return sum + job.months;
  }, 0);

  return Math.round(totalDuration / jobs.length);
}

/**
 * Add average job duration to the tech profile response
 * @param techProfile The tech profile response
 * @returns The tech profile response with average job duration added
 */
export function getProfileJobDuration(
  techProfile: TResumeTechProfileDocument,
): TResumeProfileJobDuration {
  return { averageJobDuration: calculateAverageJobDuration(techProfile.jobs) };
}
