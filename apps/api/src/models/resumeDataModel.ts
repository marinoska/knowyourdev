import { Document, Model, model, Schema } from "mongoose";
import {
  ExtractedCVData,
  JobEntry,
  ROLE_TYPE,
  TechnologyEntry,
} from "@kyd/common/api";
import { TUploadDocument } from "@/models/upload.model.js";

export type TResumeDataDocument<TJob = JobEntry> = Document &
  ExtractedCVData<TJob> & {
    uploadRef: Schema.Types.ObjectId | TUploadDocument;
  };

export type TResumeDataModel = Model<TResumeDataDocument>;

const TechnologyEntrySchema = new Schema<TechnologyEntry>(
  {
    original: { type: String, required: true },
    normalized: { type: String, default: "" },
    code: { type: String, default: "" },
    proficiency: { type: String, enum: ["skilled", "expert", "familiar", ""] },
    techReference: {
      type: Schema.Types.ObjectId, // Use ObjectId to reference another model
      ref: "TechList", // Name of the model being referenced
    },
  },
  { _id: false },
);

const TechStackSchema = {
  _id: false,
  stackName: { type: String, required: true },
  matchedComponents: [{ type: String, required: true }],
  matchPercentage: { type: Number, required: true },
};

const JobEntrySchema = new Schema<JobEntry>(
  {
    text: { type: String, required: true },
    role: { type: String, required: true },
    summary: { type: String, required: true },
    roleType: {
      type: String,
      enum: ROLE_TYPE,
    },
    isSoftwareDevelopmentRole: { type: Boolean, default: false },
    job: { type: String, required: true },
    start: { type: String, required: true }, // Format: 'mm-yyyy'
    end: { type: String, required: true }, // Format: 'mm-yyyy'
    months: { type: Number, required: true },
    present: { type: Boolean, default: false },
    // softwareDevelopmentScope: {type: String, enum: ["BE", "FE", "FS", ""]},
    // isMobileDevelopmentRole: {type: Boolean, default: false},
    technologies: [TechnologyEntrySchema],
    techStack: [TechStackSchema],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const resumeDataSchema = new Schema<TResumeDataDocument, TResumeDataModel>(
  {
    uploadRef: {
      type: Schema.Types.ObjectId, // Refers to ObjectId type in MongoDB
      ref: "Upload", // The name of the model/collection being referenced
      required: true, // Ensure this is always provided
      unique: true,
    },
    fullName: { type: String, required: true, immutable: true },
    position: { type: String, required: true, default: "" },
    sections: [{ type: String }],
    profileSection: {
      text: {
        type: String,
        required: true,
        default: "",
      },
      technologies: [TechnologyEntrySchema],
      techStack: [TechStackSchema],
    },
    skillSection: {
      text: {
        type: String,
        required: true,
        default: "",
      },
      technologies: [TechnologyEntrySchema],
      techStack: [TechStackSchema],
    },
    jobs: [JobEntrySchema],
  },
  { timestamps: true, collection: "ResumeData", autoIndex: true },
);

export const ResumeDataModel = model<TResumeDataDocument, TResumeDataModel>(
  "ResumeData",
  resumeDataSchema,
);
