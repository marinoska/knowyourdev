import {
  ResumeTechProfileJobEntry,
  TResumeProfileBaseResponse,
  TResumeProfileGaps,
  TResumeProfileCategories,
} from "@kyd/common";

/**
 * Categorizes jobs into different groups and calculates the earliest job start date
 * @param jobs Array of jobs
 * @returns Object containing categorized jobs and earliest job start date
 */
export function categorizeJobs(jobs: ResumeTechProfileJobEntry[]) {
  if (!jobs || !jobs.length) {
    return {
      softwareDevelopmentJobs: [],
      irrelevantJobs: [],
      jobsWithMissingTech: [],
      jobsWithFilledTech: [],
      earliestJobStart: new Date(),
    };
  }

  const sortedJobs = jobs.sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  );

  const devJobs: ResumeTechProfileJobEntry[] = [];
  const otherJobs: ResumeTechProfileJobEntry[] = [];
  const jobsWithMissingTech: ResumeTechProfileJobEntry[] = [];
  const jobsWithFilledTech: ResumeTechProfileJobEntry[] = [];

  // Get the earliest job start date
  const earliestJobStart = sortedJobs.length ? sortedJobs[0].start : new Date();

  // Categorize jobs
  for (const job of sortedJobs) {
    if (job.isSoftwareDevelopmentRole) {
      devJobs.push(job);
      if (!job.technologies?.length) {
        jobsWithMissingTech.push(job);
      } else {
        jobsWithFilledTech.push(job);
      }
    } else {
      otherJobs.push(job);
    }
  }

  return {
    softwareDevelopmentJobs: devJobs,
    irrelevantJobs: otherJobs,
    jobsWithMissingTech,
    jobsWithFilledTech,
    earliestJobStart,
  };
}

/**
 * Add job categories to the tech profile response
 * @param resumeProfile The tech profile response
 * @returns The job categories
 */
export function getProfileCategories(
  resumeProfile: TResumeProfileBaseResponse & TResumeProfileGaps,
): TResumeProfileCategories {
  return categorizeJobs(resumeProfile.jobs);
}
