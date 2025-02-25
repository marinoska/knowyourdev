import { model, Schema } from 'mongoose';
import { CVDataDocumentType, CVDataModelType } from "./types.js";

// const techmologyEntrySchema = {
//     originalName: {type: String, required: true},
//     name: {type: String},
//     code: {type: String},
//     proficiency: {type: String, enum: ["skilled", "expert", "familiar", ""]},
// };

const cvDataSchema = new Schema<CVDataDocumentType, CVDataModelType>(
    {
        hash: {type: String, required: true, immutable: true, unique: true},
        fullName: {type: String, required: true, immutable: true},
        profileSection: {type: String, required: true, immutable: true},
        skillSection: {type: String, required: true, immutable: true},
        // technologies: [
        //     techmologyEntrySchema
        // ],
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
                // summary: {type: String, required: true},
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
                // technologies: [{type: String}],
                // stack: [
                //     {
                //         stackName: {type: String, required: true},
                //         matchedComponents: [{type: String, required: true}],
                //         matchPercentage: {type: Number, required: true},
                //     }
                // ],
            }
        ],
    },
    {timestamps: true, collection: 'cvData', autoIndex: true}
);

export const CvDataModel = model<CVDataDocumentType, CVDataModelType>('cv', cvDataSchema);
