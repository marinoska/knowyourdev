import { model, Schema } from 'mongoose';
import { CATEGORY, TechDocument, TechModelType, TREND } from "./types.js";

const techSchema = new Schema<TechDocument, TechModelType>(
    {
        name: {type: String, required: true, immutable: true, unique: true},
        code: {type: String, required: true, immutable: true, unique: true},
        trend: {type: String, enum: TREND, required: true},
        category: {type: String, enum: CATEGORY, required: true},
        usage2024: {type: Number, required: false},
        usage2016: {type: Number, required: false},
    },
    {timestamps: true, collection: 'tech', autoIndex: true}
);

techSchema.index({category: 1});

export const TechModel = model<TechDocument, TechModelType>('tech', techSchema);
