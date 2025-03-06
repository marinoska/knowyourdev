import { model, Schema } from "mongoose";
import {
    CATEGORY,
    SCOPE,
    TechProfileDocumentType, TechProfileJobEntry,
    TechProfileModelType,
    TechProfileTechnologiesEntry,
    TREND
} from "@/models/types.js";

const JobSchema =
    {
        _id: false, // No separate _id for sub-documents
        start: {type: Date, required: true},
        end: {type: Date, required: true},
        role: {type: String, required: true},
        company: {type: String, required: true},
    };

const TechProfileJobEntrySchema = new Schema<TechProfileJobEntry>({
    start: Date,
    end: Date,
    months: {type: Number, required: true},
    popularity: Number,
    trending: Number,
    techStack: {
        type: {
            ref: {type: Schema.Types.ObjectId, ref: 'TechStack', required: true},
            name: String,
            popularity: Number,
            trending: Number,
        }, required: false
    },
    technologies: [{
        ref: {type: Schema.Types.ObjectId, ref: 'tech', required: true},
        name: String,
        popularity: Number,
        trending: Number,
    }]
}, {
    _id: false,
});

const TechProfileTechnologiesEntrySchema = new Schema<TechProfileTechnologiesEntry>(
    {
        techReference: {type: Schema.Types.ObjectId, ref: 'tech', required: true},
        code: {type: String, required: true}, // Assuming TechCode is a string
        jobs: {type: [JobSchema], required: false},
        totalMonths: {type: Number, required: false},
        recentMonths: {type: Number, required: false},
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
        inProfileSection: Boolean,
        inSkillsSection: Boolean,
    }, {
        _id: false, // No separate _id for sub-documents;
    });

const TechProfileSchema = new Schema<TechProfileDocumentType, TechProfileModelType>(
    {
        hash: {type: String, required: true, unique: true}, // Unique hash for identifying the profile
        fullName: {type: String, required: true},
        technologies: {type: [TechProfileTechnologiesEntrySchema], required: true, default: []}, // List of technology entries
        jobs: {type: [TechProfileJobEntrySchema], required: true, default: []},
    },
    {timestamps: true, collection: 'techProfile'} // Automatically adds createdAt and updatedAt
);

export const TechProfileModel = model<TechProfileDocumentType, TechProfileModelType>('techProfile', TechProfileSchema);