import mongoose, { Document, Model, Schema } from "mongoose";
import { SCOPE, TProject, TTechnology } from "@kyd/common/api";
import { patch, getPage, createNew, deleteById } from "@/models/project.statics.js";

export type TProjectDocument = Document &
  TProject<Schema.Types.ObjectId, Schema.Types.ObjectId>;

export type TProjectDocumentPopulated = Document &
  TProject<Schema.Types.ObjectId, TTechnology>;

export type TProjectModel = Model<
  TProjectDocument | TProjectDocumentPopulated
> & {
  patch: typeof patch;
  getPage: typeof getPage;
  createNew: typeof createNew;
  deleteById: typeof deleteById;
};

const ProjectSchema = new Schema<TProjectDocument, TProjectModel>(
  {
    name: { type: String, required: true },
    settings: {
      baselineJobDuration: { type: Number, default: 1 }, // Default to 12 months
      techFocus: {
        type: [{ required: true, type: String, enum: SCOPE }],
        default: [],
      },
      description: { type: String, default: "" },
      expectedRecentRelevantYears: { type: Number, default: 1 },
      technologies: {
        required: true,
        type: [
          {
            ref: {
              type: Schema.Types.ObjectId,
              ref: "TechList",
              required: true,
            },
            code: { type: String, required: true },
            name: { type: String, required: true },
          },
        ],
        default: [],
      },
    },
    candidates: [{ type: Schema.Types.ObjectId, ref: "Upload", default: [] }],
  },
  { timestamps: true, collection: "Project", autoIndex: true },
);

ProjectSchema.static("patch", patch);
ProjectSchema.static("getPage", getPage);
ProjectSchema.static("createNew", createNew);
ProjectSchema.static("deleteById", deleteById);

export const ProjectModel = mongoose.model<TProjectDocument, TProjectModel>(
  "Project",
  ProjectSchema,
);
