import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { extractCVData } from "@/chain/extraction/cvData/extractCVData.chain.js";
import { pipe } from "@/utils/func.js";
import { ExtractionChainParam } from "@/chain/extraction/types.js";
import { extractTechnologies } from "@/chain/extraction/techs/extractTechnologies.chain.js";
import { aggregateAndSave } from "@/chain/extraction/aggregateAndSave.js";
import { TechListModel } from "@/models/techList.model.js";
import { TUploadDocument } from "@/models/upload.model.js";
import logger from "@/app/logger.js";
import { env } from "@/app/env.js";
import path from "node:path";
import mammoth from "mammoth";
import { Schema } from "mongoose";
import { ExtractedCVData } from "@kyd/common/api";

const log = logger("DataExtraction");
const dir = env("UPLOAD_DIR");

async function extractCVText(
  filePath: string,
  contentType: string,
): Promise<string> {
  if (contentType.includes("wordprocessingml.document")) {
    // Handle .docx files
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  if (contentType.includes("pdf")) {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    return docs.map((doc) => doc.pageContent).join(" ");
  }

  throw new Error("Unknown file type: " + contentType);
}

/*
    await TechModel.init();
    await TechStackModel.init();
    await CvDataModel.init();
 */

export async function processUpload(upload: TUploadDocument) {
  try {
    const filePath = path.join(process.cwd(), dir, upload.filename);
    const cvText = await extractCVText(filePath, upload.contentType);

    const data = await runCVDataExtraction(cvText, upload._id);
    upload.parseStatus = "processed";
    void upload.save();
  } catch (error) {
    //TODO process failed on FE
    upload.parseStatus = "failed";
    void upload.save();
    log.error("Upload processing error: " + upload._id, error);
  }
}

export async function runCVDataExtraction(
  cvText: string,
  uploadId: Schema.Types.ObjectId,
): Promise<ExtractedCVData> {
  if (!cvText || cvText.trim() === "") {
    throw new Error("CV text extraction failed. Please check the PDF file.");
  }

  const techCollection = await TechListModel.find().lean();

  const inputData: ExtractionChainParam = {
    cvText,
    techCollection,
    uploadId,
  };

  const output = await pipe<ExtractionChainParam>(
    inputData,
    extractCVData,
    extractTechnologies,
    aggregateAndSave,
  );

  // @ts-ignore
  return output.extractedData;
}
