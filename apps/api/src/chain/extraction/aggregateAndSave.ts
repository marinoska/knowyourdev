import { ExtractionChainParam } from "@/chain/extraction/types.js";
import { UploadDataModel } from "@/models/uploadData.model.js";
import {
    TechDocument,
} from "@/models/types.js";
import { isValid, parse, subYears } from "date-fns";
import logger from '@/app/logger.js';
import { Schema } from "mongoose";
import { UploadTechProfileModel } from "@/models/uploadTechProfile.model.js";
import { isNotNull } from "@/utils/types.utils.js";
import {
    TechCode,
    UploadTechProfileJobEntry,
    UploadTechProfileTechnologiesEntry,
    UploadTechProfileTechnologiesJobEntry,
    TREND_MAP, TechnologyEntry,
    JobEntry,
    TechType
} from "@kyd/common/api";
import { normalizePopularityLevel } from "@/chain/normalizer/popularityLevel.js";
import { env } from "@/app/env.js";

const log = logger('extraction:extraction:runner');

const FormatString = "MM-yyyy"; // Specify the format
const currentUsageFieldName = env('CURRENT_USAGE_FIELD_NAME') as keyof TechType;

export const aggregateAndSave = async (params: ExtractionChainParam): Promise<ExtractionChainParam> => {
    if (!("extractedData" in params))
        throw new Error("extractedData is required");

    const updatedCV = await UploadDataModel.findOneAndUpdate(
        {uploadRef: params.uploadId}, // Find by hash
        {
            $set: {uploadRef: params.uploadId, ...params.extractedData},
        }, // Set new or updated fields
        {upsert: true, new: true, runValidators: true} // Create if not exists, return updated, apply schema validations
    ).populate(
        {
            path: "jobs.technologies.techReference", // Path to populate nested techReference in jobs array
            // model: "TechModel" // Specify the model being populated
        }
    );

    const aggTechs: Record<TechCode, {
        techReference: Schema.Types.ObjectId,
        code: TechCode,

        jobs: UploadTechProfileTechnologiesJobEntry[]
    }> = {};

    for (const job of updatedCV.jobs) {
        if (!job.technologies.length) {
            continue;
        }

        job.technologies.forEach(tech => {
            const jobEntry: UploadTechProfileTechnologiesJobEntry = {role: job.role, company: job.job};
            const start = parse(job.start, FormatString, new Date());
            // TODO date cannot be empty
            if (!isValid(start)) {
                log.warn(`Invalid start date in tech profile ${job.role} ${job.start}, uploadId: ${params.uploadId}`);
                jobEntry.start = new Date();
            } else {
                jobEntry.start = start;
            }
            const end = parse(job.end, FormatString, new Date());
            if (!isValid(end)) {
                log.warn(`Invalid end date in tech profile ${job.role} ${job.end}, uploadId: ${params.uploadId}`);
                jobEntry.end = new Date();
            } else {
                jobEntry.end = end;
            }

            // Parse the date
            !aggTechs[tech.code] && (aggTechs[tech.code] = {
                techReference: tech.techReference as Schema.Types.ObjectId,
                code: tech.code,

                jobs: []
            });
            aggTechs[tech.code].jobs.push(jobEntry);
        });
    }

    const techCollectionObj: Record<TechCode, TechDocument> = params.techCollection.reduce((acc, doc) => ({
        ...acc, [doc.code]: doc
    }), {});

    const techWithTotals = Object.values(aggTechs).map<UploadTechProfileTechnologiesEntry | null>(tech => {
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
            scope: technology.scope
        } satisfies UploadTechProfileTechnologiesEntry;
    }).filter<UploadTechProfileTechnologiesEntry>(isNotNull)
        .reduce<Record<TechCode, UploadTechProfileTechnologiesEntry>>((acc, doc) => ({
            ...acc, [doc.code]: doc
        }), {});

    const enrich = (techs: TechnologyEntry[], props: Partial<UploadTechProfileTechnologiesEntry>) => {

        for (let tech of techs) {
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
            }
        }
    };

    enrich(updatedCV.skillSection.technologies, {inSkillsSection: true});
    enrich(updatedCV.profileSection.technologies, {inProfileSection: true});

    const techProfileJobs = updatedCV.jobs.map<UploadTechProfileJobEntry>((job) => {
        const technologies = job.technologies.map(tech => {
            if (!tech.techReference) return null;

            if (!("name" in tech.techReference)) {
                throw new Error(`${updatedCV._id}: UploadData jobs.tech.techReference is populated`);
            }

            return {
                ref: tech.techReference._id as Schema.Types.ObjectId,
                name: tech.techReference.name,
                popularity: normalizePopularityLevel(tech.techReference),
                trending: TREND_MAP[tech.techReference.trend],
            }
        }).filter(isNotNull);

        const start = parse(job.start, FormatString, new Date());
        // TODO date cannot be empty - process error
        if (!isValid(start)) {
            log.error(`Invalid start date in tech profile ${job.role} ${job.start}, uploadId: ${params.uploadId}`);
        }
        const end = parse(job.end, FormatString, new Date());
        if (!isValid(end)) {
            log.error(`Invalid end date in tech profile ${job.role} ${job.end}, uploadId: ${params.uploadId}`);
        }

        const avgPopularity = technologies.length
            ? technologies.reduce((acc, tech) => acc + tech.popularity, 0) / technologies.length
            : 0;

        return {
            start: isValid(start) ? start.toISOString() : (new Date()).toISOString(),
            end: isValid(end) ? end.toISOString() : (new Date()).toISOString(),
            months: job.months,
            role: job.role,
            job: job.job,
            isSoftwareDevelopmentRole: job.isSoftwareDevelopmentRole,
            roleType: job.roleType,
            present: job.present,
            trending: technologies.length
                ? technologies.reduce((acc, tech) => acc + tech.trending, 0) / technologies.length
                : 0,
            popularity: avgPopularity,
            technologies,
            summary: job.summary
            // TODO
            // techStack: {}
        }
    });

    const techProfile = await UploadTechProfileModel.findOneAndUpdate(
        {uploadRef: updatedCV.uploadRef}, // Find by hash
        {
            $set: {
                uploadRef: updatedCV.uploadRef,
                fullName: updatedCV.fullName,
                position: updatedCV.position,
                technologies: Object.values(techWithTotals),
                jobs: techProfileJobs,
            },
        }, // Set new or updated fields
        {upsert: true, new: true, runValidators: true} // Create if not exists, return updated, apply schema validations
    ).lean();

    return {...params, cvData: updatedCV, techProfile};
}

type Range = {
    start: Date,
    end: Date
};

// Function to merge overlapping date ranges
function mergeRanges(ranges: Range[]) {
    // Sort ranges by their start dates
    ranges.sort((a, b) => a.start.getTime() - b.start.getTime());

    const merged = [ranges[0]]; // Initialize with the first range

    for (let i = 1; i < ranges.length; i++) {
        const lastRange = merged[merged.length - 1];
        const currentRange = ranges[i];

        if (currentRange.start <= lastRange.end) {
            // If ranges overlap, merge them by extending the lastRange's end
            lastRange.end = new Date(Math.max(lastRange.end.getTime(), currentRange.end.getTime()));
        } else {
            // If no overlap, add the current range to the merged array
            merged.push(currentRange);
        }
    }

    return merged; // Return the merged ranges
}

// Function to calculate the total number of months covered by merged ranges
function calculateTotalMonths(ranges: Range[], yearsAgo: number = 50) {
    let totalMonths = 0;
    const today = new Date();
    const calculationStart: Date = subYears(today, yearsAgo);

    ranges.forEach((range: Range) => {
        const rangeStart = range.start >= calculationStart ? range.start : calculationStart;
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
