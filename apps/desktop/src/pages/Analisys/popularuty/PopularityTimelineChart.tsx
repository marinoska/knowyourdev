import React, { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { format } from "date-fns"; // Import date-fns for formatting
import { getRedToGreenThroughYellowWithOpacity } from "@/pages/Analisys/popularuty/normalizedColorsForValues.ts"; // Importing type definition
import { UploadTechProfileJobEntry } from "@kyd/common/api";

const getYellowToGreen = (
    popularity: number,
    minPopularity: number,
    maxPopularity: number
): string => {
    // Normalize popularity to a range [0, 1]
    const normalizedPopularity = (popularity - minPopularity) / (maxPopularity - minPopularity);

    // Interpolate between yellow (rgb(255, 255, 0)) and green (rgb(0, 128, 0))
    const red = 255 - normalizedPopularity * 255; // Red decreases from 255 to 0
    const green = 255 - normalizedPopularity * (255 - 128); // Green decreases slightly from 255 to 128
    const blue = 0; // Blue remains constant

    // Return the interpolated color as a string
    return `rgb(${Math.round(red)}, ${Math.round(green)}, ${blue})`;
};

const getPopularityColor = (
    popularity: number,
    minPopularity: number,
    maxPopularity: number
): string => {
    // Normalize popularity to a range [0, 1]
    const normalizedPopularity = (popularity - minPopularity) / (maxPopularity - minPopularity);

    // Brighter interpolation between yellow (rgb(255, 255, 128)) and green (rgb(0, 255, 0))
    const red = 255 - normalizedPopularity * 255; // Red decreases from 255 (yellow) to 0 (green)
    const green = 255; // Green stays fully bright at 255 throughout the transition
    const blue = (1 - normalizedPopularity) * 128; // Blue starts slightly bright for yellow and fades to 0 for green

    // Return the final bright RGB color
    return `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`;
};

// Transform Data for Chart
const BASE_HEIGHT = 3; // Base Y-Axis offset to prevent full downward fill

// Date Formatter using date-fns
const dateFormatter = (tick: number) => format(new Date(tick), "MMM yyyy"); // Example: "Jan 2022"

const CustomTooltip = ({active, payload}: any) => {
    if (active && payload && payload.length) {
        const job = payload[0].payload; // Extract job details

        return (
            <div style={{background: "white", padding: 10, border: "1px solid #ddd", borderRadius: 5}}>
                <p><b>{job.role}</b> at {job.job}</p>
                <p>{dateFormatter(job.date)}</p>
                <p>{job.months} months</p>
                <p>Popularity: {job.popularityMax}</p>
            </div>
        );
    }
    return null;
};

// const minPopularity = useMemo(() => Math.min(
//     ...jobsAndGaps.map((job) => job.popularity || 0)
// ), [jobsAndGaps]);
// const maxPopularity = useMemo(() => Math.max(
//     ...(jobsAndGaps || []).map((job) => job.popularity || 0)
// ), [jobsAndGaps]);

const PopularityTimelineChart = ({jobs}: { jobs: UploadTechProfileJobEntry[] }) => {
    const [transformedData, segments] = useMemo(() => {
        const transformedData: any[] = [];
        const segments: any[] = [];

        jobs.forEach((job, index) => {
            // TODO process invalid data
            if (!job.start || !job.end) return;
            const popularity = job.popularity || 0;
            // Calculate the color based on popularity
            const color = getRedToGreenThroughYellowWithOpacity(popularity, 0, 50); // Assuming popularity ranges from 0 to 100
            // Convert dates to timestamps
            const startTimestamp = new Date(job.start).getTime();
            const endTimestamp = new Date(job.end).getTime();

            // Add start & end points with role, company, and popularity (height)
            transformedData.push(
                {
                    date: startTimestamp,
                    popularityMin: popularity,
                    popularityMax: popularity + -BASE_HEIGHT,
                    role: job.role,
                    company: job.job,
                    months: job.months,
                    technologies: job.technologies,
                },
                {
                    date: endTimestamp,
                    popularityMin: popularity,
                    popularityMax: popularity + BASE_HEIGHT,
                    role: job.role,
                    company: job.job,
                    months: job.months,
                    technologies: job.technologies,
                }
            );

            // Store segments separately for coloring
            segments.push([
                {
                    date: startTimestamp, popularityMin: popularity - BASE_HEIGHT,
                    popularityMax: popularity + BASE_HEIGHT,
                    color
                },
                {
                    date: endTimestamp, popularityMin: popularity - BASE_HEIGHT,
                    popularityMax: popularity + BASE_HEIGHT,
                    color
                },
            ]);
        });
        return [transformedData, segments];
    }, [jobs]);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={transformedData}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis
                    type="number"
                    dataKey="date"
                    domain={["auto", "auto"]}
                    tickFormatter={dateFormatter}
                />
                <YAxis dataKey="popularityMax" domain={[0, 50]}/> {/* Scale includes base height */}
                <Tooltip content={<CustomTooltip/>}/>

                {/* Render each segment as a separate filled Area */}
                {segments.map((segment, index) => (
                    <Area
                        key={index}
                        type="monotone"
                        data={segment}
                        dataKey="popularityMax"
                        baseValue={segment[0].popularityMin} // Base level, preventing full fill down
                        // stroke={segment[0].color}
                        fill={segment[0].color}
                        fillOpacity={segment[0].opacity}
                    />
                ))}
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default PopularityTimelineChart;
