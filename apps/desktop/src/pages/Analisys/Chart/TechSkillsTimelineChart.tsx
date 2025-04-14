import { useEffect, useMemo, useRef } from "react";
import { Chart, ReactGoogleChartEvent } from "react-google-charts";
import { Checkbox, FormControl, FormLabel, Stack, Typography } from "@mui/joy";
import { useGoogleChartAutoHeight } from "@/pages/Analisys/useGoogleChartAutoHeight.ts";
import { monthsToYearsAndMonths } from "@/utils/dates.ts";
import { Tooltip } from "@/components/Tooltip.tsx";
import { ScopeSelect } from "@/pages/Analisys/Chart/Components/ScopeSelect.tsx";
import { ChartTitle } from "@/pages/Analisys/Chart/Components/ChartTitle.tsx";
import { useFilteredTechnologies } from "@/pages/Analisys/useFilteredTechnologies.ts";

//* TODO add a position description via a tooltip

export const TechSkillsTimelineChart = ({setChartIsReady, setChartIsEmpty}: {
    setChartIsReady: (b: boolean) => void,
    setChartIsEmpty: (b: boolean) => void
}) => {
    const chartRef = useRef(null);
    const {chartHeight, handleChartResize, setChartHeight} = useGoogleChartAutoHeight(chartRef);

    const {
        allTechnologies,
        filteredTechnologies,
        selectedScope,
        setSelectedScope,
        showKeyTechOnly,
        setShowKeyTechOnly
    } = useFilteredTechnologies();

    const chartData = useMemo(() => {
        const data = filteredTechnologies.map((tech) => {
            const {years, months} = monthsToYearsAndMonths(tech.totalMonths);
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

        if (!filteredTechnologies?.length) {
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
    }, [filteredTechnologies, setChartIsEmpty]);

    // rerender chart to adapt height for new data row amount
    useEffect(() => {
        setChartIsReady(false);
        setChartHeight('20px');
    }, [setChartIsReady, setChartHeight, showKeyTechOnly, selectedScope]);

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
            gap={3}
            sx={{
                backgroundColor: "#fff",
            }}
        >
            <ChartTitle title='Tech Timeline'/>

            <>
                <FormControl>
                    <FormLabel>
                        <Checkbox
                            checked={showKeyTechOnly}
                            onChange={(e) => setShowKeyTechOnly(e.target.checked)}
                            sx={{marginRight: 1, borderColor: 'neutral.outlinedBorder'}}
                        />
                        Show only key technologies (mentioned in skills section)
                        <Tooltip
                            title="Include only the technologies that the candidate explicitly mentioned in their skills section."/>

                    </FormLabel>
                </FormControl>
                <ScopeSelect
                    label='Filter by Tech Scope'
                    data={allTechnologies}
                    selectedScope={selectedScope}
                    onScopeChange={setSelectedScope}
                    sx={{width: 200}}
                />
            </>

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
