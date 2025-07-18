import { globals } from "@/app/globals.js";
import { TTechnology } from "@kyd/common/api";
import { env } from "@/app/env.js";

const currentUsageFieldName = env(
  "CURRENT_USAGE_FIELD_NAME",
) as keyof TTechnology;

export const normalizePopularityLevel = (tech: TTechnology) => {
  const usage = (tech[currentUsageFieldName] as number) || 0;
  return (usage * 100) / globals.maxUsage![tech.category]!;
};
