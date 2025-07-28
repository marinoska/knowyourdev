import { ExtractedData } from "@/chain/extraction/resume/types.js";
import { TResumeDataDocument } from "@/models/resumeDataModel.js";
import { TechDocument } from "@/models/types.js";
import { subYears } from "date-fns";
import { Schema } from "mongoose";
import { isNotNull } from "@/utils/types.utils.js";
import {
  TechCode,
  ResumeProfileJobEntry,
  ResumeProfileTechnologiesEntry,
  ResumeProfileTechnologiesJobEntry,
  TREND_MAP,
  TechnologyEntry,
  EnhancedJobEntry,
  JobEntry,
} from "@kyd/common/api";
import { normalizePopularityLevel } from "@/chain/normalizer/popularityLevel.js";
import { mergeRanges, Range } from "@kyd/common";
import { parseMonthEndUtc, parseMonthStartUtc } from "@/utils/dates.js";

export const aggregate = async (
  params: ExtractedData,
  resumeDocument: TResumeDataDocument<JobEntry>,
): Promise<
  ExtractedData & {
    techWithTotals: Record<TechCode, ResumeProfileTechnologiesEntry>;
    techProfileJobs: ResumeProfileJobEntry[];
  }
> => {
  const updatedCV = {
    ...resumeDocument,
    jobs: resumeDocument.jobs.map<EnhancedJobEntry>((job: JobEntry) => {
      // create EnhancedJobEntry type
      return {
        ...job,
        start: parseMonthStartUtc(job.start),
        end: parseMonthEndUtc(job.end),
      };
    }),
  };

  const aggTechs: Record<
    TechCode,
    {
      techReference: Schema.Types.ObjectId;
      code: TechCode;
      jobs: ResumeProfileTechnologiesJobEntry[];
    }
  > = {};

  for (const job of updatedCV.jobs) {
    if (!job.technologies.length) {
      continue;
    }

    job.technologies.forEach((tech: TechnologyEntry) => {
      const jobEntry: ResumeProfileTechnologiesJobEntry = {
        role: job.role,
        company: job.job,
        start: job.start,
        end: job.end,
      };

      if (!aggTechs[tech.code]) {
        aggTechs[tech.code] = {
          techReference: tech.techReference as Schema.Types.ObjectId,
          code: tech.code,

          jobs: [],
        };
      }

      aggTechs[tech.code].jobs.push(jobEntry);
    });
  }

  const techCollectionObj: Record<TechCode, TechDocument> =
    params.techCollection.reduce(
      (acc, doc) => ({
        ...acc,
        [doc.code]: doc,
      }),
      {},
    );

  const techWithTotals = Object.values(aggTechs)
    .map<ResumeProfileTechnologiesEntry | null>((tech) => {
      const mergedRanges = mergeRanges(tech.jobs as Range[]); // Merge the overlapping ranges
      const totalMonths = calculateTotalMonths(mergedRanges); // Calculate total unique months
      const recentMonths = calculateTotalMonths(mergedRanges, 3); // Calculate total unique months

      const technology = techCollectionObj[tech.code];
      if (!technology) {
        return null;
      }

      return {
        techReference: tech.techReference,
        code: tech.code,
        jobs: tech.jobs,
        totalMonths,
        recentMonths,
        name: technology.name,
        trend: technology.trend,
        popularity: normalizePopularityLevel(technology),
        category: technology.category,
        scope: technology.scope,
      } satisfies ResumeProfileTechnologiesEntry;
    })
    .filter<ResumeProfileTechnologiesEntry>(isNotNull)
    .reduce<Record<TechCode, ResumeProfileTechnologiesEntry>>(
      (acc, doc) => ({
        ...acc,
        [doc.code]: doc,
      }),
      {},
    );

  const enrich = (
    techs: TechnologyEntry[],
    props: Partial<ResumeProfileTechnologiesEntry>,
  ) => {
    for (const tech of techs) {
      if (!tech.code) {
        continue;
      }
      const technology = techCollectionObj[tech.code];

      if (!technology) {
        continue;
      }

      techWithTotals[tech.code] = {
        ...(techWithTotals[tech.code] || {}),
        techReference: tech.techReference as Schema.Types.ObjectId,
        code: tech.code,
        name: technology.name,
        trend: technology.trend,
        popularity: normalizePopularityLevel(technology),
        category: technology.category,
        scope: technology.scope,
        ...props,
      };
    }
  };

  enrich(updatedCV.skillSection.technologies, { inSkillsSection: true });
  enrich(updatedCV.profileSection.technologies, { inProfileSection: true });

  const techProfileJobs: ResumeProfileJobEntry[] = updatedCV.jobs.map(
    (job: EnhancedJobEntry) => {
      const technologies = job.technologies
        .map((tech) => {
          if (!tech.techReference) return null;

          if (!("name" in tech.techReference)) {
            throw new Error(
              `${updatedCV._id}: ResumeData jobs.tech.techReference is populated`,
            );
          }

          return {
            ref: tech.techReference._id as Schema.Types.ObjectId,
            name: tech.techReference.name,
            popularity: normalizePopularityLevel(tech.techReference),
            trending: TREND_MAP[tech.techReference.trend],
          };
        })
        .filter(isNotNull);

      const avgPopularity = technologies.length
        ? technologies.reduce((acc, tech) => acc + tech.popularity, 0) /
          technologies.length
        : 0;

      return {
        start: job.start,
        end: job.end,
        months: job.months,
        role: job.role,
        job: job.job,
        isSoftwareDevelopmentRole: job.isSoftwareDevelopmentRole,
        roleType: job.roleType,
        present: job.present,
        trending: technologies.length
          ? technologies.reduce((acc, tech) => acc + tech.trending, 0) /
            technologies.length
          : 0,
        popularity: avgPopularity,
        technologies,
        summary: job.summary,
        // TODO
        // techStack: {}
      };
    },
  );

  return {
    ...params,
    techWithTotals,
    techProfileJobs,
  };
};

// Function to calculate the total number of months covered by merged ranges
function calculateTotalMonths(ranges: Range[], yearsAgo: number = 50) {
  let totalMonths = 0;
  const today = new Date();
  const calculationStart: Date = subYears(today, yearsAgo);

  ranges.forEach((range: Range) => {
    const rangeStart =
      range.start >= calculationStart ? range.start : calculationStart;
    const rangeEnd = range.end;
    if (rangeEnd < calculationStart) {
      return;
    }

    const startYear = rangeStart.getFullYear();
    const startMonth = rangeStart.getMonth();
    const endYear = rangeEnd.getFullYear();
    const endMonth = rangeEnd.getMonth();

    totalMonths += (endYear - startYear) * 12 + (endMonth - startMonth + 1);
  });

  return totalMonths;
}
