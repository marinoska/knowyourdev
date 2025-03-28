import React, { useMemo, useRef } from "react";
import { Chart, ReactGoogleChartEvent } from "react-google-charts";
import { Box, Typography } from "@mui/joy";
import { UploadTechProfileJobEntry, GAP_JOB, GAP_ROLE } from "@kyd/types/api";
import { useAutoChartHeight } from "@/pages/Analisys/useAutoChartHeight.ts";
import { differenceInMonths, addMonths } from 'date-fns';

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
type Job = Omit<UploadTechProfileJobEntry, 'start' | 'end'> & {
    start: Date;
    end: Date;
};

type Gap = Pick<Job, 'job' | 'role' | 'months' | 'start' | 'end' | 'popularity'>;
export const CareerTimelineChart: React.FC<TechTimelineProps> = ({jobs = []}) => {
    const sortedJobs = jobs.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    const jobsAndGaps = useMemo(() => {
        const jobsAndGaps: Array<Job | Gap> = [];

        for (const job of sortedJobs) {
            // TODO make sure jobs are not empty then remove defaults
            const start = job.start ? new Date(job.start) : new Date(0); // Default to epoch if start is undefined
            const end = job.end ? new Date(job.end) : new Date(); // Default to now if end is undefined
            if (jobsAndGaps.length) {

                const lastJob = jobsAndGaps[jobsAndGaps.length - 1];
                const monthsGap = differenceInMonths(job.start, lastJob.end);
                if (monthsGap > 1) {
                    jobsAndGaps.push({
                        role: GAP_ROLE,
                        job: GAP_JOB,
                        start: addMonths(lastJob.end, 1),
                        end: start,
                        months: monthsGap,
                        popularity: 0,
                    });
                }
            }
            jobsAndGaps.push({...job, start, end});
        }

        return jobsAndGaps;
    }, [sortedJobs]);
    const minPopularity = useMemo(() => Math.min(
        ...jobsAndGaps.map((job) => job.popularity || 0)
    ), [jobsAndGaps]);
    const maxPopularity = useMemo(() => Math.max(
        ...(jobsAndGaps || []).map((job) => job.popularity || 0)
    ), [jobsAndGaps]);

    // Transform data into Google Charts Timeline format
    const chartData = [
        ["Role", "Name", "Start Date", "End Date"], // Header row with style column
        ...jobsAndGaps.map((job) => {

            return [
                job.role || "Undefined Role", // Role fallback
                job.job || "Undefined Name", // Name fallback
                job.start,
                job.end,
            ]
        }),
    ];

// Move "Gap" rows to the top of the chart
    const [header, ...rows] = chartData;

    const sortedRows = rows.sort((a, b) => {
        const isGapA = a[0] === GAP_ROLE;
        const isGapB = b[0] === GAP_ROLE;
        if (isGapA && !isGapB) return -1;
        if (!isGapA && isGapB) return 1;

        return 0;
    });

    const sortedChartData = [header, ...sortedRows];
    const options = {
        colors: [
            // '#E57373', // Gaps color
            '#FFD800', // Gaps color (first row)
            ...Array(sortedChartData.length - 1).fill('#4CAF50')
        ],
        timeline: {
            showRowLabels: true,
            groupByRowLabel: true,
            colorByRowLabel: true,
        },
    };

    const chartRef = useRef(null);
    const {chartHeight, handleChartReady} = useAutoChartHeight(chartRef);

    const chartEvents: ReactGoogleChartEvent[] = [
        {
            eventName: "ready",
            callback: () => {
                handleChartReady();
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

            {jobsAndGaps.length === 0 ? (
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
                            data={sortedChartData}
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