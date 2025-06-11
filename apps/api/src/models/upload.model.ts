import mongoose, { Document, Model, Schema } from "mongoose";
import { ParsedStatus } from "@kyd/common/api";

export type TUpload = {
  originalName: string; // Original filename
  filename: string; // Stored filename (hashed or unique)
  hash: string; // SHA-256 hash for deduplication
  contentType: string; // MIME type (e.g., application/pdf, image/png)
  // data: Buffer;          // Binary file data
  size: number; // File size in bytes
  r2Key?: string; // Cloudflare R2 object key
  r2Url?: string; // Cloudflare R2 object URL
  metadata: {
    name: string;
    role: string;
  };
  parseStatus: ParsedStatus;
};

export type TUploadDocument = Document &
  TUpload & {
    _id: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };
export type TUploadModel = Model<TUploadDocument>;

const UploadSchema = new Schema<TUploadDocument, TUploadModel>(
  {
    originalName: { type: String, required: true, immutable: true },
    filename: { type: String, required: false, immutable: true },
    hash: { type: String, required: true, immutable: true },
    contentType: { type: String, required: true, immutable: true },
    size: { type: Number, required: true, immutable: true },
    r2Key: { type: String, required: true, immutable: true },
    r2Url: { type: String, required: true, immutable: true },
    metadata: {
      name: { type: String, required: true },
      role: { type: String, default: "" },
    },
    parseStatus: { type: String, default: "pending" },
  },
  { timestamps: true, collection: "Upload", autoIndex: true },
);

export const UploadModel = mongoose.model<TUploadDocument, TUploadModel>(
  "Upload",
  UploadSchema,
);
