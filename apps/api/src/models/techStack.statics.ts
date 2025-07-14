import { TechStackModelType } from "./types.js";
import { isNotNull } from "@/utils/types.utils.js";
import { TechCode, TechStack } from "@kyd/common/api";

export async function identifyStack(
  this: TechStackModelType,
  techCodes: TechCode[],
): Promise<TechStack[]> {
  const stacks = await this.find({}, { name: 1, components: 1 });

  const techCodesSet = new Set(techCodes);
  const matchesPromises = stacks.map((stack) =>
    stack.matchTechList(techCodesSet),
  );

  return (await Promise.all(matchesPromises)).filter(isNotNull);
}
