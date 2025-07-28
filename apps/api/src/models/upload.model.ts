import mongoose, { Document, Model, Schema } from "mongoose";
import { ParsedStatus, TUpload } from "@kyd/common/api";
import { applyOwnershipEnforcement } from "@/middleware/mongoOwnershipEnforcement.js";
import { get } from "@/models/upload.statics.js";

export type TUploadDTO = {
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
    projectId: string;
  };
  parseStatus: ParsedStatus;
};

export type TUploadDocument = Document &
  TUploadDTO & {
    _id: Schema.Types.ObjectId;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
export type TUploadModel = Model<TUploadDocument> & {
  get: typeof get;
};

const UploadSchema = new Schema<TUploadDocument, TUploadModel>(
  {
    originalName: { type: String, required: true, immutable: true },
    filename: { type: String, required: false, immutable: true },
    hash: { type: String, required: true, immutable: true },
    contentType: { type: String, required: true, immutable: true },
    size: { type: Number, required: true, immutable: true },
    r2Key: { type: String, required: true, immutable: true },
    r2Url: { type: String, required: true, immutable: true },
    userId: { type: String, required: true, immutable: true, index: true },
    metadata: {
      name: { type: String, required: true },
      projectId: { type: String, default: "" },
    },
    parseStatus: { type: String, default: "pending" },
  },
  { timestamps: true, collection: "Upload", autoIndex: true },
);

applyOwnershipEnforcement(UploadSchema);

UploadSchema.static("get", get);

export const UploadModel = mongoose.model<TUploadDocument, TUploadModel>(
  "Upload",
  UploadSchema,
);
