import { model, Schema } from 'mongoose';
import { CVDataDocumentType, CVDataModelType } from "./types.js";

const TechnologyEntrySchema = {
    original: {type: String, required: true},
    normalized: {type: String, default: ""},
    code: {type: String, default: ""},
    proficiency: {type: String, enum: ["skilled", "expert", "familiar", ""]},
};

const TechStackSchema = {
    stackName: {type: String, required: true},
    matchedComponents: [{type: String, required: true}],
    matchPercentage: {type: Number, required: true},
};

const cvDataSchema = new Schema<CVDataDocumentType, CVDataModelType>(
    {
        hash: {type: String, required: true, immutable: true, unique: true},
        fullName: {type: String, required: true, immutable: true},
        profileSection: {
            text: {
                type: String, required: true, default: ""
            },
            technologies: [
                TechnologyEntrySchema
            ],
            stack: [
                TechStackSchema
            ],
        },
        skillSection: {
            text: {
                type: String, required: true, default: ""
            },
            technologies: [
                TechnologyEntrySchema
            ],
            stack: [
                TechStackSchema
            ],
        },
        // techStack: [
        //     {
        //         stackName: {type: String, required: true},
        //         matchedComponents: [{type: String, required: true}],
        //         matchPercentage: {type: Number, required: true},
        //     }
        // ],
        jobs: [
            {
                text: {type: String, required: true},
                role: {type: String, required: true},
                summary: {type: String, required: true},
                // roleType: {
                //     type: String,
                //     enum: ["SE", "QA", "UI/UX", "PM", ""]
                // },
                // softwareDevelopmentScope: {type: String, enum: ["BE", "FE", "FS", ""]},
                // isSoftwareDevelopmentRole: {type: Boolean, default: false},
                // isMobileDevelopmentRole: {type: Boolean, default: false},
                job: {type: String, required: true},
                start: {type: String, required: true}, // Format: 'mm-yyyy'
                end: {type: String, required: true},   // Format: 'mm-yyyy'
                months: {type: Number, required: true},
                present: {type: Boolean, default: false},
                technologies: [
                    TechnologyEntrySchema
                ],
                stack: [
                    TechStackSchema
                ],
            }
        ],
    },
    {timestamps: true, collection: 'cvData', autoIndex: true}
);

export const CvDataModel = model<CVDataDocumentType, CVDataModelType>('cv', cvDataSchema);
