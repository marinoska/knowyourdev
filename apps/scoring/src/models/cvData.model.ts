import { Document, Model, model, Schema } from 'mongoose';
import { SectionsNames, TechDocument, TechStack } from "@/models/types";
import { ProficiencyType, ScopeType, TechCode } from "@kyd/types/api";

export type JobEntry = {
    _id: Schema.Types.ObjectId;
    role: string;
    roleType: "SE" | "QA" | "UI/UX" | "PM" | "DO" | "",
    isSoftwareDevelopmentRole: boolean,
    softwareDevelopmentScope: ScopeType | "",
    summary: string,
    job: string;
    start: string; // Format: 'mm-yyyy'
    end: string;   // Format: 'mm-yyyy'
    months: number;
    present: boolean;
    text: string;
    technologies: TechnologyEntry[];
    techStack: TechStack[];
};
export type TechnologyEntry = {
    original: string; // Exact name as found in the job description
    normalized: string | ""; // Name from TechList by AI
    code: TechCode | ""; // Code of normalized name
    proficiency: ProficiencyType;
    techReference: Schema.Types.ObjectId | TechDocument | null;
};
export type ExtractedCVData = {
    // technologies: TechnologiesEntry[],
    // techStack: TechStack[];
    position: string;
    sections: SectionsNames[];
    fullName: string;
    profileSection: {
        text: string;
        technologies: TechnologyEntry[];
        techStack: TechStack[];
    };
    skillSection: {
        text: string;
        technologies: TechnologyEntry[];
        techStack: TechStack[];
    }
    jobs: JobEntry[];
};
export type CVDataDocumentType = Document & ExtractedCVData & {
    uploadRef: Schema.Types.ObjectId;
};
export type CVDataModelType = Model<CVDataDocumentType>;

const TechnologyEntrySchema = new Schema<TechnologyEntry>({
    original: {type: String, required: true},
    normalized: {type: String, default: ""},
    code: {type: String, default: ""},
    proficiency: {type: String, enum: ["skilled", "expert", "familiar", ""]},
    techReference: {
        type: Schema.Types.ObjectId, // Use ObjectId to reference another model
        ref: "tech" // Name of the model being referenced
    },
}, {_id: false});

const TechStackSchema = {
    _id: false,
    stackName: {type: String, required: true},
    matchedComponents: [{type: String, required: true}],
    matchPercentage: {type: Number, required: true},
};

const JobEntrySchema = new Schema<JobEntry>(
    {
        text: {type: String, required: true},
        role: {type: String, required: true},
        summary: {type: String, required: true},
        roleType: {
            type: String,
            enum: ["SE", "QA", "UI/UX", "PM", ""]
        },
        isSoftwareDevelopmentRole: {type: Boolean, default: false},
        // softwareDevelopmentScope: {type: String, enum: ["BE", "FE", "FS", ""]},
        // isMobileDevelopmentRole: {type: Boolean, default: false},
        job: {type: String, required: true},
        start: {type: String, required: true}, // Format: 'mm-yyyy'
        end: {type: String, required: true},   // Format: 'mm-yyyy'
        months: {type: Number, required: true},
        present: {type: Boolean, default: false},
        technologies: [
            TechnologyEntrySchema
        ],
        techStack: [
            TechStackSchema
        ],
    });

const cvDataSchema = new Schema<CVDataDocumentType, CVDataModelType>(
    {
        uploadRef: {
            type: Schema.Types.ObjectId, // Refers to ObjectId type in MongoDB
            ref: "upload", // The name of the model/collection being referenced
            required: true, // Ensure this is always provided
            unique: true,
        },
        fullName: {type: String, required: true, immutable: true},
        position: {type: String, required: true, default: ""},
        sections: [{type: String}],
        profileSection: {
            text: {
                type: String, required: true, default: ""
            },
            technologies: [
                TechnologyEntrySchema
            ],
            techStack: [
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
            techStack: [
                TechStackSchema
            ],
        },
        jobs: [JobEntrySchema],
    },
    {timestamps: true, collection: 'cvData', autoIndex: true}
);

export const CvDataModel = model<CVDataDocumentType, CVDataModelType>('cv', cvDataSchema);
