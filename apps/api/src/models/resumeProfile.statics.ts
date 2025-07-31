import {
  TResumeTechProfileModel,
  TResumeProfileDocument,
} from "@/models/resumeProfileModel.js";
import { Schema } from "mongoose";

export async function getOne(
  this: TResumeTechProfileModel,
  {
    uploadRef,
    _userId,
  }: {
    uploadRef: Schema.Types.ObjectId | string;
    _userId: string;
  },
): Promise<TResumeProfileDocument | null> {
  return this.findOne({ uploadRef }).setOptions({ userId: _userId }).lean();
}
