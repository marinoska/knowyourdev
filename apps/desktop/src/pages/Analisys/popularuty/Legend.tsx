import { Box, Typography } from "@mui/joy";

const getColorFromPercentage = (percentage: number): string => {
    const r = percentage < 0.5 ? 255 : Math.round(255 - (percentage - 0.5) * 2 * 255);
    const g = percentage < 0.5 ? Math.round(percentage * 2 * 255) : 255;
    const b = 0; // No blue component in the gradient
    return `rgb(${r}, ${g}, ${b})`; // Generate RGB color
};

const getColorByPopularity = (popularity: number = 0, maxPopularity: number, minPopularity: number): string => {
    if (!popularity || maxPopularity === minPopularity) {
        return getColorFromPercentage(0); // Default to min (red) if undefined or no range
    }
    const percentage =
        (popularity - minPopularity) / (maxPopularity - minPopularity); // Normalize 0 to 1
    return getColorFromPercentage(percentage);
};

export const Legend = () => {
    return (<Box sx={{mt: 4, display: "flex", flexDirection: "column", gap: 2}}>
        <Typography sx={{fontWeight: 600}}>Popularity Legend:</Typography>
        <Box sx={{display: "flex", gap: 4}}>
            {/* Red (Low Popularity) */}
            <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                <Box
                    sx={{
                        width: 16,
                        height: 16,
                        backgroundColor: "rgb(255, 0, 0)", // Red
                        borderRadius: "50%",
                    }}
                />
                <Typography>Low Popularity</Typography>
            </Box>

            {/* Yellow (Medium Popularity) */}
            <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                <Box
                    sx={{
                        width: 16,
                        height: 16,
                        backgroundColor: "rgb(255, 255, 0)", // Yellow
                        borderRadius: "50%",
                    }}
                />
                <Typography>Medium Popularity</Typography>
            </Box>

            <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                <Box
                    sx={{
                        width: 16,
                        height: 16,
                        backgroundColor: "rgb(0, 255, 0)", // Green
                        borderRadius: "50%",
                    }}
                />
                <Typography>High Popularity</Typography>
            </Box>
        </Box>
    </Box>)

}