export type Range = {
    start: Date,
    end: Date,
};

export function mergeRanges(ranges: Range[]): Range[] {
    // Sort ranges by their start dates
    ranges.sort((a, b) => a.start.getTime() - b.start.getTime());

    const merged = [ranges[0]]; // Initialize with the first range

    for (let i = 1; i < ranges.length; i++) {
        const lastRange = merged[merged.length - 1];
        const currentRange = ranges[i];

        if (currentRange.start <= lastRange.end) {
            // If ranges overlap, merge them by extending the lastRange's end
            lastRange.end = new Date(Math.max(lastRange.end.getTime(), currentRange.end.getTime()));
        } else {
            // If no overlap, add the current range to the merged array
            merged.push(currentRange);
        }
    }

    return merged; // Return the merged ranges
}
