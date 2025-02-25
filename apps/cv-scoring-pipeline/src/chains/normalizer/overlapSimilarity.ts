export const overlapSimilarity = <T extends string>(referenceList: T[]) => (value: string): T | undefined => {
    if (referenceList.includes(value as T)) {
        return value as T;
    }

    // Try to map with Jaccard Similarity
    let bestMatch = undefined as T | undefined;
    let highestScore = 0;

    // const jaccardSimilarity = (str1: string, str2: string): number => {
    //     const set1 = new Set(str1.toLowerCase());
    //     const set2 = new Set(str2.toLowerCase());
    //     const intersection = new Set([...set1].filter((char) => set2.has(char)));
    //     return intersection.size / new Set([...set1, ...set2]).size;
    // };

    const jaccardSimilarityNGrams = (str1: string, str2: string, n = 2): number => {
        const getNGrams = (str: string, n: number): string[] =>
            [...str].map((_, i, arr) => (i < arr.length - (n - 1) ? arr.slice(i, i + n).join('') : null))
                .filter(Boolean) as string[];

        const set1 = new Set(getNGrams(str1.toLowerCase(), n));
        const set2 = new Set(getNGrams(str2.toLowerCase(), n));

        const intersection = new Set([...set1].filter(ngram => set2.has(ngram)));
        const union = new Set([...set1, ...set2]);

        if (value === "cloudinfrastructure") {
            console.log({highestScore, bestMatch})
        }
        return intersection.size / union.size;
    };


    if (value === "cloudinfrastructure") {
        console.log({highestScore, bestMatch})
    }

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

