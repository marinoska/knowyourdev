import natural from 'natural';

/**
 * Function to normalize proficiency values dynamically
 * @returns normalized proficiency category
 */
export const normalizeToReferenceList = <T extends string>(referenceList: T[]) => (value: string): T | undefined => {
    const lowerValue = value.toLowerCase().trim(); // Normalize case and trim spaces

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
    return highestScore > 0.75 ? bestMatch : undefined;
};

// Example Usage:
// console.log(normalizeToReferenceList<ProficiencyType>([...PROFICIENCY])("intermediate"));  // → "skilled"
// console.log(normalizeToReferenceList<ProficiencyType>([...PROFICIENCY])("high proficiency"));  // → "expert"
// console.log(normalizeToReferenceList<ProficiencyType>([...PROFICIENCY])("somewhat familiar"));  // → "familiar"
// console.log(normalizeToReferenceList<ProficiencyType>([...PROFICIENCY])("random text"));  // → ""

