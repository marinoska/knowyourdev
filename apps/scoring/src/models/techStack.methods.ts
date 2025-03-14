import { TechCode, TechStack, TechStackDocumentType } from "./types";

// Methods on Document level (TechStackDocument)

export async function matchTechList(this: TechStackDocumentType, techCodeSet: Set<TechCode>): Promise<TechStack | null> {
    if (techCodeSet.has(this.name)) {
        return {
            stackName: this.name,
            matchedComponents: [this.name],
            matchPercentage: 100
        }
    }

    const matches: TechCode[] = this.components.and.filter((code: TechCode) => techCodeSet.has(code));
    for (const techs of this.components.or) {
        const found = techs.find((code: TechCode) => techCodeSet.has(code))
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
