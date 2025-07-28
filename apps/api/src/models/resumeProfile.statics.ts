import {
  TResumeTechProfileModel,
  TResumeProfileDocument,
} from "@/models/resumeProfileModel.js";
import { TResumeProfile } from "@kyd/common/api";
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
  const resumeProfile = await this.findOne({ uploadRef })
    .setOptions({ userId: _userId });

  return resumeProfile;
}
