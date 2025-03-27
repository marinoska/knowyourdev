import React, { useMemo, useRef, useState } from "react";
import { Chart, ReactGoogleChartEvent } from "react-google-charts";
import { Box, Typography } from "@mui/joy";
import { UploadTechProfileJobEntry } from "@kyd/types/api";
import { useAutoChartHeight } from "@/pages/Analisys/useAutoChartHeight.ts";

interface TechTimelineProps {
    jobs: UploadTechProfileJobEntry[];
}

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

export const CareerTimelineChart: React.FC<TechTimelineProps> = ({jobs: validJobs = []}) => {
    const minPopularity = useMemo(() => Math.min(
        ...validJobs.map((job) => job.popularity || 0)
    ), [validJobs]);
    const maxPopularity = useMemo(() => Math.max(
        ...(validJobs || []).map((job) => job.popularity || 0)
    ), [validJobs]);

    // Transform data into Google Charts Timeline format
    const chartData = [
        ["Role", "Name", "Start Date", "End Date", {type: "string", role: "style"}], // Header row with style column
        ...validJobs.map((job) => [
            job.role || "Undefined Role", // Role fallback
            job.job || "Undefined Name", // Name fallback
            job.start ? new Date(job.start) : new Date(0), // Default to epoch if start is undefined
            job.end ? new Date(job.end) : new Date(), // Default to now if end is undefined
            `color: ${getColorByPopularity(job.popularity, maxPopularity, minPopularity)}`, // Dynamic gradient-based color
        ]),
    ];
    const startDates = [
        ...new Set(
            chartData.slice(1)
                .map(row => row[2])
                .filter((d): d is Date => d instanceof Date) // 👈 filter only Dates
                .map(d => d.toISOString())
        )
    ].map(iso => new Date(iso));
    console.log({startDates})
    const options = {
        timeline: {
            showRowLabels: true,
            groupByRowLabel: true,
        },
        avoidOverlappingGridLines: true,
    };

    const drawVerticalLines = () => {

        requestAnimationFrame(() => {
            const svg = chartRef.current?.querySelector('svg[aria-label="A chart."]');
            if (!svg) return;

            // Remove previously drawn lines
            svg.querySelectorAll(".custom-tick-line").forEach(line => line.remove());

            const bars = svg.querySelectorAll("rect");

            const svgHeight = parseFloat(svg.getAttribute("height") || "0");

            const drawTickLine = (x: number) => {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", `${x}`);
                line.setAttribute("x2", `${x}`);
                line.setAttribute("y1", "0");
                line.setAttribute("y2", `${svgHeight - 50}`);
                line.setAttribute("stroke", "gray");
                line.setAttribute("stroke-dasharray", "2,2");
                line.setAttribute("stroke-width", "1");
                line.classList.add("custom-tick-line");
                svg.appendChild(line);
            };

            // Add lines at bar starts only (or both start and end if you prefer)
            bars.forEach((bar) => {
                const x = parseFloat(bar.getAttribute("x") || "0");
                drawTickLine(x);
            });
        });

    };

    const chartRef = useRef(null);
    const {chartHeight, handleChartReady} = useAutoChartHeight(chartRef);

    const chartEvents: ReactGoogleChartEvent[] = [
        {
            eventName: "ready",
            callback: () => {
                handleChartReady();
                drawVerticalLines();
            }
        },
    ];

    return (
        <Box
            sx={{
                p: 4,
                backgroundColor: "#fff",
            }}
        >
            <Typography level="h2" sx={{fontSize: "1.25rem", fontWeight: 600, mb: 2}}>
                Tech Timeline
            </Typography>

            {validJobs.length === 0 ? (
                <Typography>No data available to display the timeline chart.</Typography>
            ) : (
                <>
                    <div ref={chartRef}>
                        <Chart
                            chartType="Timeline"
                            width="100%"
                            // height="auto"
                            height={chartHeight}
                            options={options}
                            chartEvents={chartEvents}
                            data={chartData}
                            loader={<Typography>Loading Chart...</Typography>}
                        />
                    </div>
                    {/* Custom Legend */}
                    <Box sx={{mt: 4, display: "flex", flexDirection: "column", gap: 2}}>
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

                            {/* Green (High Popularity) */}
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
                    </Box>
                </>
            )}
        </Box>
    );
};