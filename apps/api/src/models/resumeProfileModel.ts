import { Document, Model, model, Schema } from "mongoose";

import {
  CATEGORY,
  SCOPE,
  ROLE_TYPE,
  ResumeProfileJobEntry,
  ResumeProfileTechnologiesEntry,
  TREND,
  TResumeProfile,
} from "@kyd/common/api";
import { TUploadDocument } from "@/models/upload.model.js";
import { applyOwnershipEnforcement } from "@/middleware/mongoOwnershipEnforcement.js";
import { getOne } from "@/models/resumeProfile.statics.js";

const JobSchema = {
  _id: false, // No separate _id for sub-documents
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
};

const ResumeProfileJobEntrySchema = new Schema<ResumeProfileJobEntry>(
  {
    start: Date,
    end: Date,
    months: { type: Number, required: true },
    popularity: Number,
    trending: Number,
    summary: { type: String, required: true },
    techStack: {
      type: {
        ref: { type: Schema.Types.ObjectId, ref: "TechStack", required: true },
        name: String,
        popularity: Number,
        trending: Number,
      },
      required: false,
    },
    roleType: {
      type: String,
      enum: ROLE_TYPE,
    },
    isSoftwareDevelopmentRole: { type: Boolean, default: false },
    job: { type: String, required: true },
    role: { type: String, required: true },
    present: { type: Boolean, default: false },
    technologies: [
      {
        ref: { type: Schema.Types.ObjectId, ref: "TechList", required: true },
        name: String,
        popularity: Number,
        trending: Number,
      },
    ],
  },
  {
    _id: false,
  },
);

const ResumeProfileTechnologiesEntrySchema =
  new Schema<ResumeProfileTechnologiesEntry>(
    {
      techReference: {
        type: Schema.Types.ObjectId,
        ref: "TechList",
        required: true,
      },
      code: { type: String, required: true }, // Assuming TechCode is a string
      jobs: { type: [JobSchema], required: true },
      totalMonths: { type: Number, required: false },
      recentMonths: { type: Number, required: false },
      name: { type: String, required: true },
      trend: {
        type: String,
        enum: Object.values(TREND), // Enum for TrendType
        required: true,
      },
      popularity: {
        type: Number,
        required: true,
      },
      category: {
        type: String,
        enum: Object.values(CATEGORY), // Enum for CategoryType
        required: true,
      },
      scope: {
        type: String,
        enum: SCOPE, // Enum for ScopeType
        required: true,
      },
      inProfileSection: Boolean,
      inSkillsSection: Boolean,
    },
    {
      _id: false, // No separate _id for sub-documents;
    },
  );

export type TResumeProfileDocument = Document &
  TResumeProfile & {
    userId: string;
    uploadRef: Schema.Types.ObjectId | TUploadDocument;
    createdAt: Date;
    updatedAt: Date;
  };

export type TResumeTechProfileModel = Model<TResumeProfileDocument> & {
  getOne: typeof getOne;
};

const ResumeProfileSchema = new Schema<
  TResumeProfileDocument,
  TResumeTechProfileModel
>(
  {
    uploadRef: {
      type: Schema.Types.ObjectId, // Refers to ObjectId type in MongoDB
      ref: "Upload", // The name of the model/collection being referenced
      required: true, // Ensure this is always provided
      unique: true,
    },
    userId: { type: String, required: true, immutable: true, index: true },
    fullName: { type: String, required: true },
    position: { type: String, required: true },
    technologies: {
      type: [ResumeProfileTechnologiesEntrySchema],
      required: true,
      default: [],
    }, // List of technology entries
    jobs: {
      type: [ResumeProfileJobEntrySchema],
      required: true,
      default: [],
    },
  },
  { timestamps: true, collection: "ResumeTechProfile" }, // Automatically adds createdAt and updatedAt
);

applyOwnershipEnforcement(ResumeProfileSchema);

ResumeProfileSchema.static("getOne", getOne);

export const ResumeProfileModel = model<
  TResumeProfileDocument,
  TResumeTechProfileModel
>("ResumeTechProfile", ResumeProfileSchema);
