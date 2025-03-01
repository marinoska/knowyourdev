import { model, Schema } from "mongoose";
import { ProfileDocumentType, ProfileModelType, TechDocument, TechModelType } from "@/models/types.js";

export const ProfileSchema = new Schema<ProfileDocumentType, ProfileModelType>(
    {
        hash: {type: String, required: true, immutable: true, unique: true},
        fullName: {type: String, required: true, immutable: true},
    },
    {timestamps: true, collection: 'profile', autoIndex: true}
);

export const ProfileModel = model<TechDocument, TechModelType>('profile', ProfileSchema);
