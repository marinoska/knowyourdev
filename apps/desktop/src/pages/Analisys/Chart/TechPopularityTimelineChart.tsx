import { useFilteredTechnologies } from "@/pages/Analisys/Chart/Core/useFilteredTechnologies.ts";
import { useEffect, useMemo } from "react";
import { ChartContainer } from "@/pages/Analisys/Chart/Components/ChartContainer.tsx";
import { ScopeSelect } from "@/pages/Analisys/Chart/Components/ScopeSelect.tsx";
import { TimelineChart } from "@/pages/Analisys/Chart/Components/TimelineChart.tsx";
import { defaultTimelineOptions } from "@/utils/chart.ts";

const PopularityMapping: Record<number, string> = {
    20: 'Very Low',
    40: 'Low',
    60: 'Medium',
    80: 'High',
    100: 'Very High',
}

const getPopularityLabel = (popularity: number) => {
    for (const limit of Object.keys(PopularityMapping).map(Number)) {
        if (popularity <= limit) {
            return PopularityMapping[limit];
        }
    }
}

export const TechPopularityTimelineChart = () => {
    const {
        allTechnologies,
        filteredTechnologies,
        selectedScope,
        setSelectedScope,
        setShowKeyTechOnly
    } = useFilteredTechnologies();

    useEffect(() => {
        setShowKeyTechOnly(true);
    }, [setShowKeyTechOnly]);

    const chartData = useMemo(() => {
        if (!filteredTechnologies?.length) {
            return [];
        }

        const data = filteredTechnologies.sort((a, b) => b.popularity - a.popularity)
            .map((tech) => {
                const popularity = getPopularityLabel(tech.popularity);
                return tech.jobs.map(job => (
                    [
                        popularity,
                        tech.name,
                        job.start,
                        job.end,
                    ]
                ));
            }).flat();

        return [
            [
                "Popularity", "Tech", "Start", "End",
            ],
            // @ts-ignore
            ...data
        ]
    }, [filteredTechnologies]);

    const options = useMemo(() => {
        return {
            timeline: {
                ...defaultTimelineOptions,
            },
        };
    }, []);

    return (
        <ChartContainer title='Key tech popularity timeline'>
            <ScopeSelect
                label='Filter by Tech Scope'
                data={allTechnologies}
                selectedScope={selectedScope}
                onScopeChange={setSelectedScope}
                sx={{width: 200}}
            />

            <TimelineChart chartData={chartData} options={options}/>
        </ChartContainer>
    );
}