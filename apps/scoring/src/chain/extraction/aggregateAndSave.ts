import { ExtractionChainParam } from "@/chain/extraction/types";
import { UploadDataModel, TechnologyEntry } from "@/models/uploadData.model";
import {
    TechDocument,
} from "@/models/types";
import { isValid, parse, subYears } from "date-fns";
import logger from '@/app/logger';
import { Schema } from "mongoose";
import { UploadTechProfileModel } from "@/models/uploadTechProfile.model";
import { isNotNull } from "@/utils/types.utils";
import {
    TechCode,
    UploadTechProfileJobEntry,
    UploadTechProfileTechnologiesEntry,
    UploadTechProfileTechnologiesJobEntry,
    TREND_MAP
} from "@kyd/types/api";

const log = logger('extraction:extraction:runner');

const FormatString = "MM-yyyy"; // Specify the format

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
            if (!isValid(start)) {
                log.warn(`Invalid start date in tech profile ${job.role} ${job.start}, uploadId: ${params.uploadId}`);
            } else {
                jobEntry.start = start;
            }
            const end = parse(job.end, FormatString, new Date());
            if (!isValid(end)) {
                log.warn(`Invalid end date in tech profile ${job.role} ${job.end}, uploadId: ${params.uploadId}`);
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

    const withTotalMonth = Object.values(aggTechs).map<UploadTechProfileTechnologiesEntry | null>(tech => {
        const mergedRanges = mergeRanges(tech.jobs as Range[]); // Merge the overlapping ranges
        const totalMonths = calculateTotalMonths(mergedRanges); // Calculate total unique months
        const recentMonths = calculateTotalMonths(mergedRanges, 3); // Calculate total unique months

        if (!techCollectionObj[tech.code]) {
            return null;
        }

        return {
            techReference: tech.techReference,
            code: tech.code,
            jobs: tech.jobs,
            totalMonths,
            recentMonths,
            name: techCollectionObj[tech.code].name,
            trend: techCollectionObj[tech.code].trend,
            category: techCollectionObj[tech.code].category,
            scope: techCollectionObj[tech.code].scope
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
            if (!techCollectionObj[tech.code]) {
                continue;
            }

            withTotalMonth[tech.code] = {
                ...(withTotalMonth[tech.code] || {}),
                techReference: tech.techReference as Schema.Types.ObjectId,
                code: tech.code,
                name: techCollectionObj[tech.code].name,
                trend: techCollectionObj[tech.code].trend,
                category: techCollectionObj[tech.code].category,
                scope: techCollectionObj[tech.code].scope,
                jobs: [],
                ...props,
            }
        }
    };

    enrich(updatedCV.skillSection.technologies, {inSkillsSection: true});
    enrich(updatedCV.profileSection.technologies, {inProfileSection: true});

    const techProfileJobs: UploadTechProfileJobEntry[] = updatedCV.jobs.map(job => {
        const technologies = job.technologies.map(tech => {
            if (!tech.techReference) return null;

            if (!("name" in tech.techReference)) {
                throw new Error(`${updatedCV._id}: UploadData jobs.tech.techReference is populated`);
            }

            return {
                ref: tech.techReference._id as Schema.Types.ObjectId,
                name: tech.techReference.name,
                popularity: tech.techReference.usage2024 || 0,
                trending: TREND_MAP[tech.techReference.trend],
            }
        }).filter(isNotNull);

        const start = parse(job.start, FormatString, new Date());
        if (!isValid(start)) {
            log.warn(`Invalid start date in tech profile ${job.role} ${job.start}, uploadId: ${params.uploadId}`);
        }
        const end = parse(job.end, FormatString, new Date());
        if (!isValid(end)) {
            log.warn(`Invalid end date in tech profile ${job.role} ${job.end}, uploadId: ${params.uploadId}`);
        }

        return {
            start: isValid(start) ? start : undefined,
            end: isValid(end) ? end : undefined,
            months: job.months,
            trending: technologies.length
                ? technologies.reduce((acc, tech) => acc + tech.trending, 0) / technologies.length
                : 0,
            popularity: technologies.length
                ? technologies.reduce((acc, tech) => acc + tech.popularity, 0) / technologies.length
                : 0,
            technologies,
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
                technologies: Object.values(withTotalMonth),
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
