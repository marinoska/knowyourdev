import { model, Schema } from 'mongoose';
import { TECH_STACK_CATEGORY, TechName, TechStackDocumentType, TechStackModelType, TREND } from "./types.js";
import { TechStack } from "../chains/techExtraction/types.js";
import { identifyStack } from "./techStack.statics.js";

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
    {timestamps: true, collection: 'techStack'}
);

TechStackSchema.index({category: 1, popularity: 1});

TechStackSchema.static('identifyStack', identifyStack);

TechStackSchema.methods.matchTechList = async function matchTechList(techNamesSet: Set<TechName>): Promise<TechStack | null> {
    if (techNamesSet.has(this.name)) {
        return {
            stackName: this.name,
            matchedComponents: [this.name],
            matchPercentage: 100
        }
    }

    const matches: TechName[] = this.components.and.filter((name: TechName) => techNamesSet.has(name));
    for (const techs of this.components.or) {
        const found = techs.find((name: TechName) => techNamesSet.has(name))
        found && matches.push(found);
    }

    if (!matches.length) return null;

    const percentMatches = matches.length / (this.components.or.length + this.components.and.length);

    if (percentMatches < 0.75) return null;

    return {
        stackName: this.name,
        matchedComponents: matches,
        matchPercentage: percentMatches * 100
    }
}

export const TechStackModel = model<TechStackDocumentType, TechStackModelType>('techStack', TechStackSchema);
