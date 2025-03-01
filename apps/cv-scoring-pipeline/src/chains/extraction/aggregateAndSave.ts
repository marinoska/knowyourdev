import { ExtractionChainParam } from "@/chains/extraction/types.js";
import { CvDataModel } from "@/models/cvData.model.js";
import { hash } from "@/utils/crypto.js";
import { TechCode, TechDocument, TechProfileTechnologiesEntry } from "@/models/types.js";
import { parse, subYears } from "date-fns";
import logger from '@/app/logger';
import { Schema } from "mongoose";
import { TechProfileModel } from "@/models/techProfile.schema.js";

const log = logger('chain:extraction:runner');

const FormatString = "MM-yyyy"; // Specify the format

export const aggregateAndSave = async (params: ExtractionChainParam): Promise<ExtractionChainParam> => {
    if (!("extractedData" in params))
        throw new Error("extractedData is required");

    const updatedCV = await CvDataModel.findOneAndUpdate(
        {hash: hash(params.cvText)}, // Find by hash
        {
            $set: {...params.extractedData},
        }, // Set new or updated fields
        {upsert: true, new: true, runValidators: true} // Create if not exists, return updated, apply schema validations
    ).lean();

    const aggTechs: Record<TechCode, {
        techReference: Schema.Types.ObjectId,
        code: TechCode,

        jobs: { start: Date, end: Date; role: string; company: string; present: boolean }[]
    }> = {};

    for (const job of updatedCV.jobs) {
        if (!job.technologies.length) {
            continue;
        }

        job.technologies.forEach(tech => {
            const start = parse(job.start, FormatString, new Date());
            const end = parse(job.end, FormatString, new Date());
            if (isNaN(end.getTime()) || isNaN(start.getTime())) {
                log.error(`Invalid Date in ${job}, hash ${hash}`);
            }

            // Parse the date
            const jobEntry = {start, end, role: job.role, company: job.job};
            !aggTechs[tech.code] && (aggTechs[tech.code] = {
                techReference: tech.techReference!,
                code: tech.code,

                jobs: []
            });
            aggTechs[tech.code].jobs.push(jobEntry);
        })
    }

    const techCollectionObj: Record<TechCode, TechDocument> = params.techCollection.reduce((acc, doc) => ({
        ...acc, [doc.code]: doc
    }), {});

    const withTotalMonth: TechProfileTechnologiesEntry[] = Object.values(aggTechs).map(tech => {
        const mergedRanges = mergeRanges(tech.jobs); // Merge the overlapping ranges
        const totalMonths = calculateTotalMonths(mergedRanges); // Calculate total unique months
        const recentMonths = calculateTotalMonths(mergedRanges, 3); // Calculate total unique months

        if (!techCollectionObj[tech.code]) {
            return;
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
        } satisfies TechProfileTechnologiesEntry;
    }).filter(Boolean) as TechProfileTechnologiesEntry[];
    // .reduce((acc, doc) => ({
    // ...acc, [doc.code]: doc
    // }), {});

    // TechProfileModel
    const techProfile = await TechProfileModel.findOneAndUpdate(
        {hash: updatedCV.hash}, // Find by hash
        {
            $set: {
                hash: updatedCV.hash,
                fullName: updatedCV.fullName,
                technologies: withTotalMonth,
            },
        }, // Set new or updated fields
        {upsert: true, new: true, runValidators: true} // Create if not exists, return updated, apply schema validations
    ).lean();

    console.log(techProfile);
    return params;
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
