import React, { useMemo, useRef, useState } from "react";
import { Chart, ReactGoogleChartEvent } from "react-google-charts";
import { Box, Typography } from "@mui/joy";
import { useGoogleChartAutoHeight } from "@/pages/Analisys/useGoogleChartAutoHeight.ts";
import { useChartContext } from "@/pages/Analisys/ChartContext/ChartContext.tsx";

export const CareerTimelineChart = () => {
    const chartRef = useRef(null);
    const {chartHeight, handleChartReady} = useGoogleChartAutoHeight(chartRef);

    const chartContext = useChartContext();
    const chartEvents: ReactGoogleChartEvent[] = [
        {
            eventName: "ready",
            callback: handleChartReady
        },
    ];

    const chartData = useMemo(() => {
        chartContext.jobGaps;

        const sortedJobs = chartContext.profile?.jobs.sort((a, b) => a.start.getTime() - b.start.getTime()) || [];
        const gapsAndJobs = [...chartContext.jobGaps, ...sortedJobs];
        const data = gapsAndJobs.map((job) => ([
            job.role || "Undefined Role",
            job.job || "Undefined Name",
            job.start,
            job.end,
        ]));

        return [
            ["Role", "Name", "Start Date", "End Date"], // Header row with style column
            ...data
        ];
    }, [chartContext.jobGaps, chartContext.profile?.jobs]);

    const options = useMemo(() => {
        // '#E57373', // Gaps color
        const firstGapsColor = chartContext.jobGaps.length ? ['#FFD800'] : [];
        return {
            colors: [
                ...firstGapsColor, // Gaps color (first row)
                ...Array(chartData.length - 1).fill('#4CAF50')
            ],
            timeline: {
                showRowLabels: true,
                groupByRowLabel: true,
                colorByRowLabel: true,
            },
        };

    }, [chartData.length]);

    return (
        <Box
            sx={{
                backgroundColor: "#fff",
            }}
        >
            <Typography level="h2" sx={{fontSize: "1.25rem", fontWeight: 600, mb: 2}}>
                Tech Timeline
            </Typography>

            {chartContext.profile?.jobs.length === 0 ? (
                <Typography>No data available to display the timeline chart.</Typography>
            ) : (
                <div ref={chartRef}>
                    <Chart
                        chartType="Timeline"
                        width="100%"
                        height={chartHeight}
                        options={options}
                        chartEvents={chartEvents}
                        data={chartData}
                        loader={<Typography>Loading Chart...</Typography>}
                    />
                </div>
            )}
        </Box>
    );
};