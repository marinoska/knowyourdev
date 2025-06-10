import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { extractCVData } from "@/chain/extraction/cvData/extractCVData.chain.js";
import { pipe } from "@/utils/func.js";
import { ExtractionChainParam } from "@/chain/extraction/types.js";
import { extractTechnologies } from "@/chain/extraction/techs/extractTechnologies.chain.js";
import { aggregateAndSave } from "@/chain/extraction/aggregateAndSave.js";
import { TechListModel } from "@/models/techList.model.js";
import { TUploadDocument } from "@/models/upload.model.js";
import logger from "@/app/logger.js";
import mammoth from "mammoth";
import { Schema } from "mongoose";
import { ExtractedCVData } from "@kyd/common/api";
import pdfParse from "pdf-parse";
import { downloadFileFromR2 } from "@/services/r2Storage.service.js";

const log = logger("DataExtraction");

async function extractCVText(
  filePathOrBuffer: string | Buffer,
  contentType: string,
): Promise<string> {
  if (contentType.includes("wordprocessingml.document")) {
    // Handle .docx files
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
  if (contentType.includes("pdf")) {
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

      const cvText = await extractCVText(fileBuffer, upload.contentType);
      // TODO check the amount of tokens in cvText - has to be limited?
      const data = await runCVDataExtraction(cvText, upload._id);
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
