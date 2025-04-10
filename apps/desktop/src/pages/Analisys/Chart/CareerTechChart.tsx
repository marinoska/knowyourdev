import { useMemo, useRef } from "react";
import { Chart, ReactGoogleChartEvent } from "react-google-charts";
import { Stack, Typography } from "@mui/joy";
import { useGoogleChartAutoHeight } from "@/pages/Analisys/useGoogleChartAutoHeight.ts";
import { useChartContext } from "@/pages/Analisys/ChartContext/ChartContext.tsx";
import { RedLegendColor } from "@/utils/const";
import { GreenLegendColor } from "@/utils/const.ts";
import { Job } from "@/api/query/types.ts";
import { format } from "date-fns";
import { Legend } from "@/components/Legend.tsx";
import { Tooltip } from "@/components/Tooltip.tsx";

const LegendItems = [
    {label: 'Tech stack specified', color: GreenLegendColor},
    {label: 'Missing or unrecognized Tech Stack', color: RedLegendColor},
];

export const tooltip = (job: Job) => `<div style="padding: 0.5rem;">
                <h4>
                    ${job.role}
                    <br>
                    ${format(job.start, 'MM-yyyy')} - ${job.present ? 'present' : format(job.end, 'MM-yyyy')}
                </h4>
                <p>
                </p>
                <p>
                    ${job.technologies.map(({name}) => name).join(',')}
                </p>
            </div>`;

export const CareerTechChart = () => {
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
        const missingTechJobsData = chartContext.jobsWithMissingTech.map((job) => {
            return [
                job.role || "Undefined role",
                'No tech specified',
                // tooltip(job),
                job.start,
                job.end,
            ]
        });

        const jobsData = chartContext.jobsWithFilledTech.map((job) => {
            const techList = job.technologies.map(tech => tech.name);

            return [
                job.role || "Undefined role",
                techList.join(','),
                // tooltip(job),
                job.start,
                job.end,
            ]
        });

        return [
            [
                "Role",
                "Tech",
                // {type: 'string', role: 'tooltip'},
                "Start Date",
                "End Date"
            ], // Header row with style column
            ...missingTechJobsData,
            ...jobsData,
        ];
    }, [chartContext.jobsWithFilledTech, chartContext.jobsWithMissingTech]);

    const missingTechJobsRowCount = new Set(chartContext.jobsWithMissingTech.map(job => job.job)).size;
    const jobsWithFilledTechRowCount = new Set(chartContext.jobsWithFilledTech.map(job => job.job)).size;

    const options = useMemo(() => {
        return {
            allowHtml: true,
            colors: [
                ...Array(missingTechJobsRowCount).fill(RedLegendColor), // irrelevant jobs color
                ...Array(jobsWithFilledTechRowCount).fill(GreenLegendColor)
            ],
            timeline: {
                showRowLabels: true,
                groupByRowLabel: true,
                colorByRowLabel: true,
                rowLabelStyle: {fontSize: 14},
                barLabelStyle: {fontSize: 14}
            },
        };

    }, [jobsWithFilledTechRowCount, missingTechJobsRowCount]);

    return (
        <Stack
            gap={2}
            sx={{
                backgroundColor: "#fff",
            }}
        >
            <Stack gap={0.5} direction="row" sx={{alignItems: "center"}}>

                <Typography level="h2" sx={{fontSize: "1.25rem", fontWeight: 600}}>
                    Tech Timeline
                </Typography>
                <Tooltip
                    title='Tech timeline displays the roles and their associated technologies over time, based on job descriptions provided by the candidate.'/>
            </Stack>
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
// TODO hints for legend
