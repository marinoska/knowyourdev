import { TUploadModel, TUploadDocument } from "@/models/upload.model.js";
import { TUpload } from "@kyd/common/api";

export async function get(
  this: TUploadModel,
  {
    id,
    _userId,
  }: {
    id: string;
    _userId: string;
  },
): Promise<TUpload | null> {
  const upload = await this.findById(id).setOptions({ userId: _userId }).lean();

  return upload as TUpload | null;
}
