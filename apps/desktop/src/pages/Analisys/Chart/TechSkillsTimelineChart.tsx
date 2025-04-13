import { useEffect, useMemo, useRef, useState } from "react";
import { Chart, ReactGoogleChartEvent } from "react-google-charts";
import { Checkbox, FormControl, FormLabel, Select, Option, Stack, Typography } from "@mui/joy";
import { useGoogleChartAutoHeight } from "@/pages/Analisys/useGoogleChartAutoHeight.ts";
import { useChartContext } from "@/pages/Analisys/ChartContext/ChartContext.tsx";
import { monthsToYearsAndMonths } from "@/utils/dates.ts";
import { Tooltip } from "@/components/Tooltip.tsx";
import { SCOPE_NAMES, ScopeType } from "@kyd/common/api";
//* TODO add a position description via a tooltip
//* TODO Filter by BE/FE/FS

const ALL_SCOPES = 'all' as const;
export const TechSkillsTimelineChart = ({setChartIsReady, setChartIsEmpty}: {
    setChartIsReady: (b: boolean) => void,
    setChartIsEmpty: (b: boolean) => void
}) => {
    const [selectedScope, setSelectedScope] = useState<ScopeType | typeof ALL_SCOPES>(ALL_SCOPES);

    const chartRef = useRef(null);
    const {chartHeight, handleChartResize, setChartHeight} = useGoogleChartAutoHeight(chartRef);
    const [showInSkillsOnly, setShowInSkillsOnly] = useState(false);

    const chartContext = useChartContext();

    const [technologies, scopeCodes] = useMemo(() => {
        const technologies = chartContext.profile?.technologies.filter(
            tech => {
                const skillSectionFilterPassed = tech.inSkillsSection || !showInSkillsOnly;
                const jobsMentioned = tech.jobs.length;

                return skillSectionFilterPassed && jobsMentioned;
            }
        ) || [];
        const scopeCodes = Array.from(new Set(technologies.map(tech => tech.scope)))

        return [technologies, scopeCodes];
    }, [chartContext.profile?.technologies, showInSkillsOnly]);

    const filteredTechnologies = useMemo(() => {
        if (selectedScope === ALL_SCOPES) {
            return technologies;
        }

        return technologies.filter(({scope}) => scope === selectedScope)
    }, [selectedScope, technologies]);

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
    }, [setChartIsReady, setChartHeight, showInSkillsOnly, selectedScope]);

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

            {!!chartData.length && (<>
                <FormControl sx={{marginTop: 2}}>
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
                </FormControl>
                <FormControl sx={{marginTop: 2}}>
                    <FormLabel>Filter by Tech Scope</FormLabel>
                    <Select
                        placeholder="Select a scope"
                        value={selectedScope} // State variable to track selected value
                        onChange={(_event, newValue) => setSelectedScope(newValue!)} // Update state on change
                        sx={{width: 200}}
                    >
                        <Option value={ALL_SCOPES}>All</Option>
                        {scopeCodes.map(scopeCode => <Option value={scopeCode}>{SCOPE_NAMES[scopeCode]}</Option>)}
                    </Select>
                </FormControl>

            </>)}

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
