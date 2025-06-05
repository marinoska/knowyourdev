import { globals } from "@/app/globals.js";
import { TechType } from "@kyd/common/api";
import { env } from "@/app/env.js";

const currentUsageFieldName = env("CURRENT_USAGE_FIELD_NAME") as keyof TechType;

export const normalizePopularityLevel = (tech: TechType) => {
  const usage = (tech[currentUsageFieldName] as number) || 0;
  return (usage * 100) / globals.maxUsage![tech.category]!;
};
