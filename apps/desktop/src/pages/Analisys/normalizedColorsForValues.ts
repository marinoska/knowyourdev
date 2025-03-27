export const getRedToGreen = (
    popularity: number,
    minPopularity: number,
    maxPopularity: number
): string => {
    // Normalize popularity to a range [0, 1]
    const normalizedPopularity = (popularity - minPopularity) / (maxPopularity - minPopularity);

    // Interpolate between red (rgb(255, 0, 0)) and green (rgb(0, 255, 0))
    const red = 255 - normalizedPopularity * 255; // Red decreases from 255 to 0
    const green = normalizedPopularity * 255; // Green increases from 0 to 255
    const blue = 0; // Blue remains constant at 0

    // Return the interpolated color as a string
    return `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`;
};

export const getRedToGreenThroughYellow = (
    popularity: number,
    minPopularity: number,
    maxPopularity: number
): string => {
    // Normalize popularity to a range [0, 1]
    const normalizedPopularity = (popularity - minPopularity) / (maxPopularity - minPopularity);

    // If popularity is in the lower half, interpolate red to yellow
    if (normalizedPopularity <= 0.5) {
        const ratio = normalizedPopularity / 0.5; // Normalize to [0, 1] within the lower half
        const red = 255; // Red stays 255
        const green = ratio * 255; // Green interpolates from 0 to 255
        return `rgb(${Math.round(red)}, ${Math.round(green)}, 0)`; // Blue stays 0
    }

    // If popularity is in the upper half, interpolate yellow to green
    const ratio = (normalizedPopularity - 0.5) / 0.5; // Normalize to [0, 1] within the upper half
    const red = (1 - ratio) * 255; // Red interpolates from 255 to 0
    const green = 255; // Green stays 255
    return `rgb(${Math.round(red)}, ${Math.round(green)}, 0)`; // Blue stays 0
};

export const getRedToGreenThroughYellowWithOpacity = (
    popularity: number,
    minPopularity: number,
    maxPopularity: number
): string => {
    // Normalize popularity to a range [0, 1]
    const normalizedPopularity = (popularity - minPopularity) / (maxPopularity - minPopularity);

    // Calculate opacity (min 0.3 for visibility, max 1)
    const opacity = 0.3 + normalizedPopularity * 0.7;

    // If popularity is in the lower half, interpolate red to yellow
    if (normalizedPopularity <= 0.5) {
        const ratio = normalizedPopularity / 0.5; // Normalize to [0, 1] within the lower half
        const red = 255; // Red stays 255
        const green = ratio * 255; // Green interpolates from 0 to 255
        return `rgba(${Math.round(red)}, ${Math.round(green)}, 0, ${opacity.toFixed(2)})`; // Blue stays 0, opacity added
    }

    // If popularity is in the upper half, interpolate yellow to green
    const ratio = (normalizedPopularity - 0.5) / 0.5; // Normalize to [0, 1] within the upper half
    const red = (1 - ratio) * 255; // Red interpolates from 255 to 0
    const green = 255; // Green stays 255
    return `rgba(${Math.round(red)}, ${Math.round(green)}, 0, ${opacity.toFixed(2)})`; // Blue stays 0, opacity added
};