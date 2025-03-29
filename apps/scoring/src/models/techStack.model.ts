import { model, Schema } from 'mongoose';
import { TECH_STACK_CATEGORY, TechStackDocumentType, TechStackModelType } from "./types";
import { identifyStack } from "./techStack.statics";
import { matchTechList } from "./techStack.methods";
import { TREND } from "@kyd/common/api";

export const TechStackSchema = new Schema<TechStackDocumentType, TechStackModelType>(
    {
        name: {type: String, required: true, immutable: true, unique: true},
        recommended: {type: Number, required: true},
        components: {
            type: {
                and: {
                    type: [String], // Array of TechDocument["code"]
                    required: true,
                },
                or: {
                    type: [[String]], // Array of arrays of TechDocument["code"]
                    required: true,
                },
            },
            required: true, // Ensures that `components` itself is provided
        },
        componentsString: {type: String, required: true},
        trend: {type: String, enum: TREND, required: true},
        popularity: {type: Number, required: true},
        languages: [
            {
                type: String, // Array of TechDocumentCode
                required: true,
            },
        ],
        relations: [
            {
                type: String, // Array of TechDocumentCode
                required: true,
            },
        ],
        category: {type: String, enum: TECH_STACK_CATEGORY, required: true},
        description: {type: String, required: true},
        useCases: {type: String, required: true},
        purpose: {type: String, required: true},
        frontEnd: {type: String, required: true},
        bestFor: {type: String, required: true},
        typicalUseCases: {type: String, required: true},
    },
    {timestamps: true, collection: 'TechStack'}
);

TechStackSchema.index({category: 1, popularity: 1});

TechStackSchema.static('identifyStack', identifyStack);

TechStackSchema.methods.matchTechList = matchTechList;

export const TechStackModel = model<TechStackDocumentType, TechStackModelType>('TechStack', TechStackSchema);
