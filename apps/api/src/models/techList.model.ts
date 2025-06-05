import { model, Schema } from "mongoose";
import { TechDocument, TechModelType } from "./types.js";
import { CATEGORY, SCOPE, TREND } from "@kyd/common/api";
import { getMaxPopularity } from "@/models/techList.statics.js";

const TechSchema = new Schema<TechDocument, TechModelType>(
  {
    name: { type: String, required: true, immutable: true, unique: true },
    code: { type: String, required: true, immutable: true, unique: true },
    trend: { type: String, enum: TREND, required: true },
    category: { type: String, enum: CATEGORY, required: true },
    scope: { type: String, enum: SCOPE, required: true },
    usage2024: { type: Number, required: false },
    usage2016: { type: Number, required: false },
  },
  { timestamps: true, collection: "TechList", autoIndex: true },
);

TechSchema.index({ category: 1, usage2024: -1 });

TechSchema.static("getMaxPopularity", getMaxPopularity);

export const TechListModel = model<TechDocument, TechModelType>(
  "TechList",
  TechSchema,
);
