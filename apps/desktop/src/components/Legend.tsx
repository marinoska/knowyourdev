import { Box, Typography } from "@mui/joy";

const getColorFromPercentage = (percentage: number): string => {
    const r = percentage < 0.5 ? 255 : Math.round(255 - (percentage - 0.5) * 2 * 255);
    const g = percentage < 0.5 ? Math.round(percentage * 2 * 255) : 255;
    const b = 0; // No blue component in the gradient
    return `rgb(${r}, ${g}, ${b})`; // Generate RGB color
};

// @ts-ignore
const getColorByPopularity = (popularity: number = 0, maxPopularity: number, minPopularity: number): string => {
    if (!popularity || maxPopularity === minPopularity) {
        return getColorFromPercentage(0); // Default to min (red) if undefined or no range
    }
    const percentage =
        (popularity - minPopularity) / (maxPopularity - minPopularity); // Normalize 0 to 1
    return getColorFromPercentage(percentage);
};

export type LegendProps = {
    title: string;
    items: {
        label: string;
        color: string;
    }[];
};

export const Legend = ({title, items}: LegendProps) => {
    return (<Box sx={{mt: 4, display: "flex", flexDirection: "column", gap: 2}}>
        <Typography sx={{fontWeight: 600}}>{title}:</Typography>
        <Box sx={{display: "flex", gap: 4}}>
            {items.map((item) => (
                <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                    <Box
                        sx={{
                            width: 16,
                            height: 16,
                            backgroundColor: item.color, // Red
                            borderRadius: "50%",
                        }}
                    />
                    <Typography>{item.label}</Typography>
                </Box>
            ))}
        </Box>
    </Box>)
}