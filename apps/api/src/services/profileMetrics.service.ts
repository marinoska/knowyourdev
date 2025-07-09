import {
  TResumeProfileGaps,
  TResumeProfileCategories,
  TResumeProfileJobDuration,
  TResumeProfileTechFocusUsage,
  TResumeProfileTechUsage,
  TResumeProfileMetrics,
} from "@kyd/common/api";

import { getProfileJobGaps } from "./profile/jobGaps.js";
import { getProfileJobDuration } from "./profile/jobDuration.js";
import { getProfileCategories } from "./profile/jobCategories.js";
import { getProfileTechFocusUsage } from "./profile/techFocusUsage.js";
import { getProfileTechUsage } from "./profile/techUsage.js";
import { TResumeProfileDocument } from "@/models/resumeProfileModel.js";

/**
 * Service for calculating various aspects of a resume profile
 */
export class ProfileMetricsService {
  /**
   * Calculate job gaps for a resume profile
   * @param profile The resume profile base response
   * @returns Object containing job gaps
   */
  getProfileJobGaps(profile: TResumeProfileDocument): TResumeProfileGaps {
    return getProfileJobGaps(profile);
  }

  /**
   * Calculate average job duration for a resume profile
   * @param profile The resume profile base response
   * @returns Object containing average job duration
   */
  getProfileJobDuration(
    profile: TResumeProfileDocument,
  ): TResumeProfileJobDuration {
    return getProfileJobDuration(profile);
  }

  /**
   * Calculate job categories for a resume profile
   * @param profile The resume profile with job gaps
   * @returns Object containing job categories
   */
  getProfileCategories(
    profile: TResumeProfileDocument,
  ): TResumeProfileCategories {
    return getProfileCategories(profile);
  }

  /**
   * Calculate tech focus usage for a resume profile
   * @param profile The resume profile with job gaps and categories
   * @returns Object containing tech focus usage
   */
  getProfileTechFocusUsage(
    profile: Pick<TResumeProfileDocument, "technologies" | "createdAt"> &
      Pick<TResumeProfileCategories, "earliestJobStart">,
  ): TResumeProfileTechFocusUsage {
    return getProfileTechFocusUsage(profile);
  }

  /**
   * Calculate tech usage for a resume profile
   * @param profile The resume profile with job gaps and categories
   * @returns Object containing tech usage
   */
  getProfileTechUsage(
    profile: Pick<TResumeProfileDocument, "technologies" | "createdAt"> &
      Pick<TResumeProfileCategories, "earliestJobStart">,
  ): TResumeProfileTechUsage {
    return getProfileTechUsage(profile);
  }

  /**
   * Calculate all profile data for a resume profile
   * @param profile The resume profile base response
   * @returns Object containing all profile data
   */
  calculateProfileMetrics(
    profile: TResumeProfileDocument,
  ): TResumeProfileMetrics {
    // Calculate job gaps and duration
    const jobGaps = this.getProfileJobGaps(profile);
    const jobDuration = this.getProfileJobDuration(profile);

    // Calculate job categories
    const profileCategories = this.getProfileCategories(profile);

    // Calculate tech focus usage
    const profileTechFocusUsage = this.getProfileTechFocusUsage({
      ...profile,
      ...profileCategories,
    });

    // Calculate tech usage
    const profileTechUsage = this.getProfileTechUsage({
      ...profile,
      ...profileCategories,
    });

    // Return combined profile data
    return {
      ...jobGaps,
      ...jobDuration,
      ...profileCategories,
      ...profileTechFocusUsage,
      ...profileTechUsage,
    };
  }
}
