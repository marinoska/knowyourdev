import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { extractResumeData } from "@/chain/extraction/resume/data/extractResumeData.chain.js";
import { ExtractionChainInput } from "@/chain/extraction/resume/types.js";
import { extractTechnologies } from "@/chain/extraction/resume/technologies/extractTechnologies.chain.js";
import { aggregate } from "@/chain/extraction/resume/aggregate.js";
import { TechListModel } from "@/models/techList.model.js";
import { TUploadDocument } from "@/models/upload.model.js";
import {
  ResumeDataModel,
  TResumeDataDocument,
} from "@/models/resumeDataModel.js";
import { ResumeProfileModel } from "@/models/resumeProfileModel.js";
import logger from "@/app/logger.js";
import mammoth from "mammoth";
import { Schema } from "mongoose";
import { JobEntry } from "@kyd/common/api";
import pdfParse from "@/utils/pdf-parse-wrapper.js";
import { downloadFileFromR2 } from "@/services/r2Storage.service.js";

const log = logger("DataExtraction");

/**
Here are typical bullet symbols found in CVs:
● (black circle)
• (small black dot)
– (en dash, often used as a fake bullet)
- (hyphen)
▪ (small square)
* (asterisk)
►, », → (arrow-like symbols)

// const bulletRegex = /[\u2022\u25CF\u25AA\u25B6\u00BB\u2192\-–*]/;
 */
const cleanup = (text: string) => {
  // Normalize all bullet-like lines to start with "●"
  return text
    .replace(/\f/g, " ") // Remove page breaks (PDF-specific)
    .replace(/\n[\-–*•▪►»→]\s+/g, " ● ") // Normalize dashed/odd bullets
    .replace(/\n●/g, " ●") // Rejoin broken bullet lines
    .replace(/([^\n])\n(?=[^\n●])/g, "$1 ") // Merge broken sentences
    .replace(/\n{2,}/g, "\n"); // Compact excessive newlines
};

async function processWordDocument(
  filePathOrBuffer: string | Buffer,
): Promise<string> {
  if (Buffer.isBuffer(filePathOrBuffer)) {
    // Use buffer directly with mammoth
    const result = await mammoth.extractRawText({ buffer: filePathOrBuffer });
    return result.value;
  } else {
    // Fallback to file path
    const result = await mammoth.extractRawText({ path: filePathOrBuffer });
    return result.value;
  }
}

async function processPdfDocument(
  filePathOrBuffer: string | Buffer,
): Promise<string> {
  if (Buffer.isBuffer(filePathOrBuffer)) {
    // Use buffer directly with pdf-parse
    const data = await pdfParse(filePathOrBuffer);
    return data.text;
  } else {
    // Fallback to PDFLoader for file paths
    const loader = new PDFLoader(filePathOrBuffer);
    const docs = await loader.load();
    return docs.map((doc) => doc.pageContent).join(" ");
  }
}

async function extractResumeText(
  filePathOrBuffer: string | Buffer,
  contentType: string,
): Promise<string> {
  let text = "";
  if (contentType.includes("wordprocessingml.document")) {
    text = await processWordDocument(filePathOrBuffer);
  }
  if (contentType.includes("pdf")) {
    text = await processPdfDocument(filePathOrBuffer);
  }

  if (text) {
    return cleanup(text);
  }

  throw new Error("Unknown file type: " + contentType);
}

const downloadFile = async (key: string): Promise<Buffer> => {
  log.info(`Downloading file from R2: ${key}`);
  const fileContent = await downloadFileFromR2(key);
  return Buffer.from(fileContent);
};

export async function processUpload(upload: TUploadDocument, buffer?: Buffer) {
  try {
    const fileBuffer = buffer
      ? buffer
      : upload.r2Key
        ? await downloadFile(upload.r2Key)
        : undefined;

    if (fileBuffer) {
      log.info(`Using file buffer for upload: ${upload._id}`);

      const cvText = await extractResumeText(fileBuffer, upload.contentType);
      // TODO check the amount of tokens in cvText - has to be limited?
      await runResumeDataExtraction(cvText, upload._id, upload.userId);
      upload.parseStatus = "processed";
      void upload.save();
    }
  } catch (error) {
    //TODO process failed on FE
    upload.parseStatus = "failed";
    void upload.save();
    log.error("Upload processing error: " + upload._id, error);
  }
}

/**
 * Processes resume text to extract structured data in a sequential pipeline:
 * 1. Extract basic resume data (personal info, jobs, sections)
 * 2. Extract and process technologies from the resume data
 * 3. Aggregate the data and save it to the database
 *
 * Each step has clear inputs and outputs, making the data flow explicit.
 */
export async function runResumeDataExtraction(
  cvText: string,
  uploadId: Schema.Types.ObjectId,
  userId: string,
): Promise<void> {
  if (!cvText || cvText.trim() === "") {
    throw new Error("CV text extraction failed. Please check the PDF file.");
  }

  const techCollection = await TechListModel.find().lean();

  // Create the initial input data
  const inputData: ExtractionChainInput = {
    cvText,
    techCollection,
    uploadId,
  };

  // Step 1: Extract resume data
  const resumeDataResult = await extractResumeData(inputData);

  // Step 2: Extract technologies
  const technologiesResult = await extractTechnologies(resumeDataResult);

  // Step 3: Find or create resume document in the database
  const resumeDocument = await ResumeDataModel.findOneAndUpdate<
    TResumeDataDocument<JobEntry>
  >(
    { uploadRef: technologiesResult.uploadId },
    {
      $set: {
        uploadRef: technologiesResult.uploadId,
        ...technologiesResult.extractedData,
      },
    },
    { upsert: true, new: true, runValidators: true }, // Create if not exists, return updated, apply schema validations
  )
    .setOptions({ userId })
    .populate({
      path: "jobs.technologies.techReference", // Path to populate nested techReference in jobs array
      // model: "TechModel" // Specify the model being populated
    })
    .lean();

  // Step 4: Process the data to prepare for resume profile creation
  const { techWithTotals, techProfileJobs } = await aggregate(
    technologiesResult,
    resumeDocument,
  );

  // Step 5: Find or create resume profile document in the database
  await ResumeProfileModel.findOneAndUpdate(
    { uploadRef: resumeDocument.uploadRef },
    {
      $set: {
        uploadRef: resumeDocument.uploadRef,
        userId, // Include userId in the set options
        fullName: resumeDocument.fullName,
        position: resumeDocument.position,
        technologies: Object.values(techWithTotals),
        jobs: techProfileJobs,
      },
    },
    { upsert: true, new: true, runValidators: true }, // Create if not exists, return updated, apply schema validations
  )
    .setOptions({ userId })
    .lean();
}
