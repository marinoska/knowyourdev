import { useEffect, useMemo, useRef, useState } from "react";
import { Chart, ReactGoogleChartEvent } from "react-google-charts";
import { Checkbox, FormControl, FormLabel, Stack, Typography } from "@mui/joy";
import { useGoogleChartAutoHeight } from "@/pages/Analisys/useGoogleChartAutoHeight.ts";
import { useChartContext } from "@/pages/Analisys/ChartContext/ChartContext.tsx";
import { convertMonthsToYearsAndMonths } from "@/utils/dates.ts";
import { Tooltip } from "@/components/Tooltip.tsx";

//* TODO add a position description via a tooltip
//* TODO Filter by BE/FE/FS

export const TechSkillsTimelineChart = ({setChartIsReady, setChartIsEmpty}: {
    setChartIsReady: (b: boolean) => void,
    setChartIsEmpty: (b: boolean) => void
}) => {
    const chartRef = useRef(null);
    const {chartHeight, handleChartResize, setChartHeight} = useGoogleChartAutoHeight(chartRef);
    const [showInSkillsOnly, setShowInSkillsOnly] = useState(false);

    const chartContext = useChartContext();

    const chartData = useMemo(() => {
        const data = chartContext.profile?.technologies.filter(
            tech => {
                const skillSectionFilterPassed = tech.inSkillsSection || !showInSkillsOnly;
                const jobsMentioned = tech.jobs.length;

                return skillSectionFilterPassed && jobsMentioned;
            }
        ).map((tech) => {
            const {years, months} = convertMonthsToYearsAndMonths(tech.totalMonths);
            const totalLabel = tech.totalMonths ? `${years}y ${months}m` : 'No duration found';

            return tech.jobs.map(job => (
                [
                    `${tech.name} - ${totalLabel}`,
                    job.company,
                    job.start,
                    job.end,
                ]
            ));
        }).flat();

        if (!data?.length) {
            setChartIsEmpty(true)
            return [];
        }

        return [
            [
                "Role",
                "Name",
                "Start",
                "End",
            ],
            // @ts-ignore
            ...data
        ]
    }, [chartContext.profile?.technologies, showInSkillsOnly]);

    useEffect(() => {
        setChartIsReady(false);
        setChartHeight('20px');
    }, [setChartIsReady, setChartHeight, showInSkillsOnly]);

    const chartEvents: ReactGoogleChartEvent[] = [
        {
            eventName: "ready",
            callback: () => {
                handleChartResize();
                setChartIsReady(true);
            }
        },
    ];

    const options = useMemo(() => {
        return {
            timeline: {
                showRowLabels: true,
                groupByRowLabel: true,
                colorByRowLabel: false,
                alternatingRowStyle: false,
                avoidOverlappingGridLines: true,
                rowLabelStyle: {fontSize: 14},
                barLabelStyle: {fontSize: 14}
            },
            backgroundColor: "#fff",
        };
    }, []);

    return (
        <Stack
            gap={2}
            sx={{
                backgroundColor: "#fff",
            }}
        >
            <Typography level="h2" sx={{fontSize: "1.25rem", fontWeight: 600}}>
                Tech Timeline
            </Typography>

            {!!chartData.length && <FormControl sx={{marginTop: 2}}>
                <FormLabel>
                    <Checkbox
                        checked={showInSkillsOnly}
                        onChange={(e) => setShowInSkillsOnly(e.target.checked)}
                        sx={{marginRight: 1, borderColor: 'neutral.outlinedBorder'}}
                    />
                    Show only key technologies (mentioned in skills section)
                    <Tooltip
                        title="Include only the technologies that the candidate explicitly mentioned in their skills section."/>

                </FormLabel>
            </FormControl>}

            {!chartData.length ? (
                <Typography>Insufficient data provided for the chart:
                    no technologies found in the job descriptions or durations are not found or specified
                </Typography>
            ) : (<div ref={chartRef}>
                <Chart
                    chartType="Timeline"
                    width="100%"
                    height={chartHeight}
                    options={options}
                    chartEvents={chartEvents}
                    data={chartData}
                    loader={<Typography>Loading Chart...</Typography>}
                />
            </div>)
            }
        </Stack>
    );
};
