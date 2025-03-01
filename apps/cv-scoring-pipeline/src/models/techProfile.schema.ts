import { model, Schema } from "mongoose";
import { CATEGORY, SCOPE, TechProfileDocumentType, TechProfileModelType, TREND } from "@/models/types.js";

const JobSchema =
    {
        _id: false, // No separate _id for sub-documents
        start: {type: Date, required: true},
        end: {type: Date, required: true},
        role: {type: String, required: true},
        company: {type: String, required: true},
    };

const TechProfileTechnologiesEntrySchema =
    {
        _id: false, // No separate _id for sub-documents;
        techReference: {type: Schema.Types.ObjectId, ref: 'Tech', required: true},
        code: {type: String, required: true}, // Assuming TechCode is a string
        jobs: {type: [JobSchema], required: true},
        totalMonths: {type: Number, required: true},
        recentMonths: {type: Number, required: true},
        name: {type: String, required: true},
        trend: {
            type: String,
            enum: Object.values(TREND), // Enum for TrendType
            required: true,
        },
        category: {
            type: String,
            enum: Object.values(CATEGORY), // Enum for CategoryType
            required: true,
        },
        scope: {
            type: String,
            enum: SCOPE, // Enum for ScopeType
            required: true,
        },
    };

const TechProfileSchema = new Schema<TechProfileDocumentType, TechProfileModelType>(
    {
        hash: {type: String, required: true, unique: true}, // Unique hash for identifying the profile
        fullName: {type: String, required: true},
        technologies: {type: [TechProfileTechnologiesEntrySchema], required: true}, // List of technology entries
    },
    {timestamps: true, collection: 'techProfile'} // Automatically adds createdAt and updatedAt
);

export const TechProfileModel = model<TechProfileDocumentType, TechProfileModelType>('techProfile', TechProfileSchema);