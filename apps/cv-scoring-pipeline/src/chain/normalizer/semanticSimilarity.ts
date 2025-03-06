import natural from 'natural';

/**
 * Function to normalize proficiency values dynamically
 * @returns normalized proficiency category
 */
export const semanticSimilarity = <T extends string>(referenceList: T[], score: number = 0.9) => (value: string): T | undefined => {
    const lowerValue = value; //.toLowerCase().trim(); // Normalize case and trim spaces

    if (referenceList.includes(lowerValue as T)) {
        return lowerValue as T;
    }

    // Try to map with fuzzy matching
    let bestMatch = "" as T;
    let highestScore = 0;

    referenceList.forEach((category) => {
        const similarity = natural.JaroWinklerDistance(lowerValue, category); // Check similarity score
        if (similarity > highestScore) {
            highestScore = similarity;
            bestMatch = category;
        }
    });

    // Return the closest match if similarity is above threshold, otherwise leave blank
    return highestScore > score ? bestMatch : undefined;
};

// Example Usage:
// console.log(semanticSimilarity<ProficiencyType>([...PROFICIENCY])("intermediate"));  // → "skilled"
// console.log(semanticSimilarity<ProficiencyType>([...PROFICIENCY])("high proficiency"));  // → "expert"
// console.log(semanticSimilarity<ProficiencyType>([...PROFICIENCY])("somewhat familiar"));  // → "familiar"
// console.log(semanticSimilarity<ProficiencyType>([...PROFICIENCY])("random text"));  // → ""

