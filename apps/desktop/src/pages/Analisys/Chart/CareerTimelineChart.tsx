import { useMemo, useRef } from "react";
import { Chart, ReactGoogleChartEvent } from "react-google-charts";
import { Stack, Typography } from "@mui/joy";
import { useGoogleChartAutoHeight } from "@/pages/Analisys/useGoogleChartAutoHeight.ts";
import { useChartContext } from "@/pages/Analisys/ChartContext/ChartContext.tsx";
import { GreenLegendColor, YellowLegendColor } from "@/utils/const";
import { RedLegendColor } from "@/utils/const.ts";
import { Legend } from "@/components/Legend.tsx";

const LegendItems = [
    {label: 'Software Development Jobs', color: GreenLegendColor},
    {label: 'Gaps', color: YellowLegendColor},
    {label: 'Irrelevant Jobs (not in development)', color: RedLegendColor},
];

export const CareerTimelineChart = () => {
    const chartRef = useRef(null);
    const {chartHeight, handleChartResize} = useGoogleChartAutoHeight(chartRef);

    const chartContext = useChartContext();
    const chartEvents: ReactGoogleChartEvent[] = [
        {
            eventName: "ready",
            callback: handleChartResize
        },
    ];

    const chartData = useMemo(() => {
        chartContext.jobGaps;

        const gapsAndJobs = [...chartContext.jobGaps, ...chartContext.irrelevantJobs, ...chartContext.softwareDevelopmentJobs];
        const data = gapsAndJobs.map((job) => {
            const role = job.role || "Undefined Role";
            const company = job.job || "Undefined Name";

            return [
                role,
                company,
                job.start,
                job.end,
                "Promotion to Senior"

            ]
        });

        return [
            ["Role", "Name", "Start Date", "End Date", {type: "string", role: "annotation"}],
            ...data
        ];
    }, [chartContext.irrelevantJobs, chartContext.jobGaps, chartContext.softwareDevelopmentJobs]);

    const options = useMemo(() => {
        const irrelevantJobsRowsCount = new Set(chartContext.irrelevantJobs.map((job) => job.role)).size;
        const softwareJobsRowsCount = new Set(chartContext.softwareDevelopmentJobs.map((job) => job.role)).size;

        const firstGapsColor = chartContext.jobGaps.length ? [YellowLegendColor] : [];
        return {
            colors: [
                ...firstGapsColor, // Gaps color (first row)
                ...Array(irrelevantJobsRowsCount).fill(RedLegendColor), // irrelevant jobs color
                ...Array(softwareJobsRowsCount).fill(GreenLegendColor)
            ],
            timeline: {
                showRowLabels: true,
                groupByRowLabel: true,
                colorByRowLabel: true,
                rowLabelStyle: {fontSize: 14},
                barLabelStyle: {fontSize: 14}
            },
        };

    }, [chartContext.irrelevantJobs, chartContext.jobGaps.length, chartContext.softwareDevelopmentJobs]);

    return (
        <Stack gap={2}
               sx={{
                   backgroundColor: "#fff",
                   mt: 2
               }}
        >
            <Typography level="h2" sx={{fontSize: "1.25rem", fontWeight: 600}}>
                Career Timeline
            </Typography>
            <Legend title={'Legend'} items={LegendItems}/>

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
        </Stack>
    );
};
