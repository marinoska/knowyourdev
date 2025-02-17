import { Model, model, Schema } from 'mongoose';
import { CATEGORY, TechStackDocument, TREND } from "./types.js";

type TechStackModel = Model<TechStackDocument>;

const techStackSchema = new Schema<TechStackDocument, TechStackModel>(
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
        category: {type: String, enum: CATEGORY, required: true},
        description: {type: String, required: true},
        useCases: {type: String, required: true},
        purpose: {type: String, required: true},
        frontEnd: {type: String, required: true},
        bestFor: {type: String, required: true},
        typicalUseCases: {type: String, required: true},
    },
    {timestamps: true}
);

techStackSchema.index({name: 1, category: 1, popularity: 1});

export default model<TechStackDocument, TechStackModel>('tech', techStackSchema);
