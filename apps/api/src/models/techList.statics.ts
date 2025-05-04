import { TechModelType } from "@/models/types.js";
import { env } from "@/app/env.js";
import { CategoryType } from "@kyd/common/api";

export async function getMaxPopularity(this: TechModelType): Promise<Record<CategoryType, number>> {
    const fieldName = env('CURRENT_USAGE_FIELD_NAME');

    const result = (await this.aggregate([
        {
            $group: {
                _id: "$category", // Group by category field
                maxUsage: {$max: `$${fieldName}`} // Calculate max usage for each category
            }
        },
        {
            $project: {
                _id: 0, // Exclude the default `_id` field
                category: "$_id", // Rename `_id` to `category`
                maxUsage: 1 // Retain the `maxUsage` field
            }
        },

    ])) as Array<{ category: CategoryType, maxUsage: number }>;

    return result.reduce((acc, doc) => ({...acc, [doc.category]: doc.maxUsage}), {} as Record<CategoryType, number>);
}

