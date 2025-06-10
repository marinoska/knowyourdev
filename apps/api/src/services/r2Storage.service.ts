import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { env } from "@/app/env.js";
import logger from "@/app/logger.js";
import { Readable } from "stream";

const log = logger("R2StorageService");

// Initialize the S3 client with Cloudflare R2 credentials
const s3Client = new S3Client({
  region: "auto",
  endpoint: env("CLOUDFLARE_API_ENDPOINT"),
  credentials: {
    accessKeyId: env("CLOUDFLARE_ACCESS_KEY_ID"),
    secretAccessKey: env("CLOUDFLARE_SECRET_ACCESS_KEY"),
  },
});

const bucketName = env("CLOUDFLARE_BUCKET");

/**
 * Upload a file to Cloudflare R2
 * @param fileBuffer - The file buffer to upload
 * @param key - The key (path) to store the file under
 * @param contentType - The MIME type of the file
 * @returns The URL of the uploaded file
 */
export async function uploadFileToR2(
  fileBuffer: Buffer,
  key: string,
  contentType: string,
): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await s3Client.send(command);
    log.info(`File uploaded to R2: ${key}`);

    // Return the URL to the file
    return `${env("CLOUDFLARE_API_ENDPOINT")}/${bucketName}/${key}`;
  } catch (error) {
    log.error(`Error uploading file to R2: ${error}`);
    throw new Error(`Failed to upload file to R2: ${error}`);
  }
}

/**
 * Download a file from Cloudflare R2
 * @param key - The key (path) of the file to download
 * @returns The file content as a string
 */
export async function downloadFileFromR2(key: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const response = await s3Client.send(command);

    if (!response.Body) {
      throw new Error("Empty response body");
    }

    // Return the string directly without converting to buffer
    return await response.Body.transformToString();
  } catch (error) {
    log.error(`Error downloading file from R2: ${error}`);
    throw new Error(`Failed to download file from R2: ${error}`);
  }
}

/**
 * Delete a file from Cloudflare R2
 * @param key - The key (path) of the file to delete
 */
export async function deleteFileFromR2(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);
    log.info(`File deleted from R2: ${key}`);
  } catch (error) {
    log.error(`Error deleting file from R2: ${error}`);
    throw new Error(`Failed to delete file from R2: ${error}`);
  }
}
