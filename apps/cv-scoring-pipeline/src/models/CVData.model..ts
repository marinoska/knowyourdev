import { model, Schema } from 'mongoose';
import { CVDataDocumentType, CVDataModelType } from "./types.js";

const cvDataSchema = new Schema<CVDataDocumentType, CVDataModelType>(
    {
        hash: {type: String, required: true, immutable: true, unique: true},
        fullName: {type: String, required: true, immutable: true},
        technologies: [
            {
                originalName: {type: String, required: true},
                name: {type: String},
                proficiency: {type: String, enum: ["skilled", "expert", "familiar", ""], default: undefined},
                skill: {type: Boolean},
                inTechList: {type: Boolean, required: true},
            }
        ],
        techStack: [
            {
                stackName: {type: String, required: true},
                matchedComponents: [{type: String, required: true}],
                matchPercentage: {type: Number, required: true},
            }
        ],
        jobs: [
            {
                role: {type: String, required: true},
                job: {type: String, required: true},
                start: {type: String, required: true}, // Format: 'mm-yyyy'
                end: {type: String, required: true},   // Format: 'mm-yyyy'
                months: {type: Number, required: true},
                present: {type: Boolean, required: true, default: false},
                description: {type: String, required: true},
                technologies: [{type: String}],
                stack: [
                    {
                        stackName: {type: String, required: true},
                        matchedComponents: [{type: String, required: true}],
                        matchPercentage: {type: Number, required: true},
                    }
                ],
            }
        ],
    },
    {timestamps: true, collection: 'cvData', autoIndex: true}
);

export const CVDataModel = model<CVDataDocumentType, CVDataModelType>('cv', cvDataSchema);
