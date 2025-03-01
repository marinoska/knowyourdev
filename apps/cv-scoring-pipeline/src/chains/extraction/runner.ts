import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { extractCVData } from "@/chains/extraction/CVData/extractCVData.chain.js";
import { ExtractedCVData } from "@/models/types.js";
import { hash } from "@/utils/crypto.js";
import { pipe } from "@/utils/func.js";
import { ExtractionChainParam } from "@/chains/extraction/types.js";
import { extractTechnologies } from "@/chains/extraction/techs/extractTechnologies.chain.js";
import { CvDataModel } from "@/models/cvData.model.js";

async function extractCVText(filePath: string): Promise<string> {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    return docs.map(doc => doc.pageContent).join(" ");
}

export async function runCVDataExtraction(filePath: string): Promise<{
    hash: string;
} & ExtractedCVData> {
    const cvText = await extractCVText(filePath);

    if (!cvText || cvText.trim() === "") {
        throw new Error("CV text extraction failed. Please check the PDF file.");
    }

    const inputData: ExtractionChainParam = {
        cvText,
    };
    const output = await pipe<ExtractionChainParam>(
        inputData,
        extractCVData,
        extractTechnologies
    );

    // type narrowing here
    if (!("extractedData" in output)) {
        throw new Error("extractedData cannot be empty");
    }

    // return {...output.extractedData, hash: hash(cvText)};

    const updatedCV = await CvDataModel.findOneAndUpdate(
        {hash: hash(cvText)}, // Find by hash
        {
            $set: {...output.extractedData},
        }, // Set new or updated fields
        {upsert: true, new: true, runValidators: true} // Create if not exists, return updated, apply schema validations
    );

    return updatedCV;


}

const aggregationPipeline = [
    {
        // Unwind the jobs array to process each job individually
        $unwind: "$jobs"
    },
    {
        // Unwind the technologies array inside each job
        $unwind: "$jobs.technologies"
    },
    {
        // Add new fields for job ranges: {start, end}
        $group: {
            _id: "$jobs.technologies.code", // Group by the technology code
            technology: {$first: "$jobs.technologies"}, // Keep one unique technology object per group
            jobRanges: {
                $push: {
                    start: "$jobs.start",
                    end: "$jobs.end"
                }
            }
        }
    },
    {
        // Perform a lookup to enrich technologies with scope data from the referenced collection
        $lookup: {
            from: "technologies_collection", // Replace with the actual referenced collection name
            localField: "technology.techReference", // Field from the `technology` to match
            foreignField: "_id", // Field in the target collection to match `_id`
            as: "referencedTech" // Output array with matching documents from the target collection
        }
    },
    {
        // Unwind the `referencedTech` array to extract the scope field (assuming one-to-one referencing)
        $unwind: {
            path: "$referencedTech",
            preserveNullAndEmptyArrays: true // In case no referenced document is found
        }
    },
    {
        // Add the `scope` field from the referenced object
        $addFields: {
            "technology.scope": "$referencedTech.scope" // Add the scope field to the technology
        }
    },
    {
        // Final projection to clean the output
        $project: {
            _id: 0, // Remove Mongo-generated _id field
            code: "$_id", // Include the technology code
            original: "$technology.original",
            normalized: "$technology.normalized",
            proficiency: "$technology.proficiency",
            scope: "$technology.scope", // Include the scope from the referenced object
            jobRanges: "$jobRanges", // Keep the job ranges as calculated before
            techReference: "$technology.techReference", // Retain original `techReference` field
        }
    }
];