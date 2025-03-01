import { model, Schema } from "mongoose";
import { TechProfileDocumentType, TechProfileModelType } from "@/models/types.js";

export const TechProfileSchema = new Schema<TechProfileDocumentType, TechProfileModelType>(
    {
        hash: {type: String, required: true, immutable: true, unique: true},
        fullName: {type: String, required: true, immutable: true},
    },
    {timestamps: true, collection: 'techProfile', autoIndex: true}
);

export const TechProfileModel = model<TechProfileDocumentType, TechProfileModelType>('techProfile', TechProfileSchema);
