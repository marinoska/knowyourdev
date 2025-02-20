import { Model, model, Schema } from 'mongoose';
import { CATEGORY, TechDocument, TREND } from "./types.js";

type TechModel = Model<TechDocument>;

const techSchema = new Schema<TechDocument, TechModel>(
    {
        name: { type: String, required: true, immutable: true, unique: true },
        code: { type: String, required: true, immutable: true, unique: true },
        trend: { type: String, enum: TREND, required: true },
        category: { type: String, enum: CATEGORY, required: true },
        usage2024: {type: Number, required: false},
        usage2016: {type: Number, required: false},
    },
    { timestamps: true, collection: 'tech', autoIndex: true  }
);

techSchema.index({ category: 1 });

export default model<TechDocument, TechModel>('tech', techSchema);
