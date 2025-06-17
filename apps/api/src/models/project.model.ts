import mongoose, { Document, Model, Schema } from "mongoose";
import { SCOPE, ScopeType } from "@kyd/common/api";

export type TProject = {
  name: string;
  settings: {
    baselineJobDuration: number;
    techFocus: ScopeType[];
    description: string;
  };
};

export type TProjectDocument = Document &
  TProject & {
    _id: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };

export type TProjectModel = Model<TProjectDocument>;

const ProjectSchema = new Schema<TProjectDocument, TProjectModel>(
  {
    name: { type: String, required: true },
    settings: {
      baselineJobDuration: { type: Number, default: 12 }, // Default to 12 months
      techFocus: [{ type: String, enum: SCOPE }],
      description: { type: String, default: "" },
    },
  },
  { timestamps: true, collection: "Project", autoIndex: true },
);

export const ProjectModel = mongoose.model<TProjectDocument, TProjectModel>(
  "Project",
  ProjectSchema,
);
