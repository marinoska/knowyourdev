import mongoose, { Document, Model, Schema } from "mongoose";
import {
  PatchProjectBody,
  PutProjectBody,
  SCOPE,
  TProject,
} from "@kyd/common/api";
import {
  patch,
  getPage,
  create,
  GtProjectsPageResult,
  GetProjectsPageParams,
} from "@/models/project.statics.js";

export type TProjectDocument = Document &
  TProject & {
    _id: string;
    createdAt: Date;
  };

export type TProjectModel = Model<TProjectDocument> & {
  patch: (
    id: string,
    projectData: PatchProjectBody,
  ) => Promise<TProjectDocument | null>;
  getPage: (params: GetProjectsPageParams) => Promise<GtProjectsPageResult>;
  create: (projectData: PutProjectBody) => Promise<TProjectDocument>;
};

const ProjectSchema = new Schema<TProjectDocument, TProjectModel>(
  {
    name: { type: String, required: true },
    settings: {
      baselineJobDuration: { type: Number }, // Default to 12 months
      techFocus: [{ required: true, type: String, enum: SCOPE }],
      description: { type: String, default: "" },
      expectedRecentRelevantYears: { type: Number },
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
ProjectSchema.static("create", create);

export const ProjectModel = mongoose.model<TProjectDocument, TProjectModel>(
  "Project",
  ProjectSchema,
);
