export const overlapSimilarity = <T extends string>(referenceList: T[]) => (value: string): T | undefined => {
    if (referenceList.includes(value as T)) {
        return value as T;
    }

    let bestMatch = undefined as T | undefined;
    let highestScore = 0;

    const jaccardSimilarityNGrams = (str1: string, str2: string, n = 2): number => {
        const getNGrams = (str: string, n: number): string[] =>
            [...str].map((_, i, arr) => (i < arr.length - (n - 1) ? arr.slice(i, i + n).join('') : null))
                .filter(Boolean) as string[];

        const set1 = new Set(getNGrams(str1.toLowerCase(), n));
        const set2 = new Set(getNGrams(str2.toLowerCase(), n));

        const intersection = new Set([...set1].filter(ngram => set2.has(ngram)));
        const union = new Set([...set1, ...set2]);

        return intersection.size / union.size;
    };

    referenceList.forEach((category) => {
        const similarity = jaccardSimilarityNGrams(value, category); // Check similarity score
        if (similarity > highestScore) {
            highestScore = similarity;
            bestMatch = category;
        }
    });

    // Return the closest match if similarity is above threshold, otherwise return undefined
    return highestScore > 0.9 ? bestMatch : undefined;
};

