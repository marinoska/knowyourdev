import mongoose, { Document, Model, Schema } from "mongoose";
import { SCOPE, TProject } from "@kyd/common/api";

export type TProjectDocument = Document &
  TProject & {
    _id: string;
    createdAt: Date;
  };

export type TProjectModel = Model<TProjectDocument>;

const ProjectSchema = new Schema<TProjectDocument, TProjectModel>(
  {
    name: { type: String, required: true },
    settings: {
      baselineJobDuration: { type: Number, default: 12 }, // Default to 12 months
      techFocus: [{ type: String, enum: SCOPE }],
      description: { type: String, default: "" },
      expectedRecentRelevantYears: { type: Number, default: 5 },
    },
    candidates: [{ type: Schema.Types.ObjectId, ref: "Upload", default: [] }],
  },
  { timestamps: true, collection: "Project", autoIndex: true },
);

export const ProjectModel = mongoose.model<TProjectDocument, TProjectModel>(
  "Project",
  ProjectSchema,
);
