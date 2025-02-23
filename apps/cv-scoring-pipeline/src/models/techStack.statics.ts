import { TechName, TechStack, TechStackModelType } from "./types.js";
import { isNotNull } from "../utils/types.utils.js";

// Methods on Model level (TechStackModel)

export async function identifyStack(this: TechStackModelType, techNames: TechName[]): Promise<TechStack[]> {
    const stacks = await this.find({}, {name: 1, components: 1});

    const techNamesSet = new Set(techNames);
    const matchesPromises = stacks.map(stack => stack.matchTechList(techNamesSet));

    return (await Promise.all(matchesPromises)).filter(isNotNull);
}
