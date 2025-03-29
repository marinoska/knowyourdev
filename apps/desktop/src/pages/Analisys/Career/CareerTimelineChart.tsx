import React, { useMemo, useRef, useState } from "react";
import { Chart, ReactGoogleChartEvent } from "react-google-charts";
import { Box, Typography } from "@mui/joy";
import { useGoogleChartAutoHeight } from "@/pages/Analisys/useGoogleChartAutoHeight.ts";
import { Job } from "@/api/query/types.ts";
import { getJobGaps } from "@/pages/Analisys/Career/ranges.ts";
import { GAP_JOB, GAP_ROLE } from "@kyd/common";

interface TechTimelineProps {
    jobs: Job[];
}

type Gap = Pick<Job, 'job' | 'role' | 'months' | 'start' | 'end' | 'popularity'>;

export const CareerTimelineChart: React.FC<TechTimelineProps> = ({jobs = []}) => {
    const [hasGaps, setHasGaps] = useState(false);
    const chartRef = useRef(null);
    const {chartHeight, handleChartReady} = useGoogleChartAutoHeight(chartRef);

    const chartEvents: ReactGoogleChartEvent[] = [
        {
            eventName: "ready",
            callback: handleChartReady
        },
    ];

    const jobsAndGaps = useMemo<(Job | Gap)[]>(() => {
        const sortedJobs = jobs.sort((a, b) => a.start.getTime() - b.start.getTime());
        const gapsRanges = getJobGaps(sortedJobs);
        gapsRanges.length && setHasGaps(true);

        return [
            ...gapsRanges.map((range) => ({
                role: GAP_ROLE,
                job: GAP_JOB,
                start: range.start,
                end: range.end,
                months: range.months,
                popularity: 0,
            })),
            ...sortedJobs,
        ];
    }, [jobs]);

    const chartData = useMemo(() => ([
        ["Role", "Name", "Start Date", "End Date"], // Header row with style column
        ...jobsAndGaps.map((job) => {

            return [
                job.role || "Undefined Role", // Role fallback
                job.job || "Undefined Name", // Name fallback
                job.start,
                job.end,
            ]
        }),
    ]), [jobsAndGaps]);

    const options = useMemo(() => {
        // '#E57373', // Gaps color
        const firstGapsColor = hasGaps ? ['#FFD800'] : [];
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

    }, [chartData.length, hasGaps]);

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
                            data={chartData}
                            loader={<Typography>Loading Chart...</Typography>}
                        />
                    </div>
                </>
            )}
        </Box>
    );
};