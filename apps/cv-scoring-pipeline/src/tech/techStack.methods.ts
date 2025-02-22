import { TechName, TechStackDocumentType } from "./types.js";
import { TechStack } from "../chains/techExtraction/types.js";

// Methods on Document level (TechStackDocument)

export async function matchTechList(this: TechStackDocumentType, techNamesSet: Set<TechName>): Promise<TechStack | null> {
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

    if (percentMatches < 0.66) return null;

    return {
        stackName: this.name,
        matchedComponents: matches,
        matchPercentage: percentMatches * 100
    }
}
