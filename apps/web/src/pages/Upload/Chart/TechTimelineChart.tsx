import { useEffect, useMemo } from "react";
import { Checkbox, FormControl, FormLabel } from "@mui/joy";
import { monthsToYearsAndMonths } from "@/utils/dates.ts";
import { Tooltip } from "@/components/Tooltip.tsx";
import { ScopeSelect } from "@/pages/Upload/Chart/Components/ScopeSelect.tsx";
import { ChartContainer } from "@/pages/Upload/Chart/Components/ChartContainer.tsx";
import { useFilteredTechnologies } from "@/pages/Upload/Chart/Core/useFilteredTechnologies.ts";
import { defaultTimelineOptions } from "@/utils/chart.ts";
import { TimelineChart } from "@/pages/Upload/Chart/Components/TimelineChart.tsx";

//* TODO add a position description via a tooltip

export const TechTimelineChart = ({
  onChartIsReady,
  onChartIsEmpty,
}: {
  onChartIsReady: (b: boolean) => void;
  onChartIsEmpty: (b: boolean) => void;
}) => {
  const {
    allTechnologies,
    filteredTechnologies,
    selectedScope,
    setSelectedScope,
    showKeyTechOnly,
    setShowKeyTechOnly,
  } = useFilteredTechnologies();

  // todo handleTechnologiesLength instead - ideally get rid of this
  useEffect(() => {
    if (!filteredTechnologies?.length) {
      onChartIsEmpty(true);
    } else {
      onChartIsEmpty(false);
    }
  }, [filteredTechnologies?.length, onChartIsEmpty]);

  const chartData = useMemo(() => {
    if (!filteredTechnologies?.length) {
      return [];
    }

    const data = filteredTechnologies
      .map((tech) => {
        const { years, months } = monthsToYearsAndMonths(tech.totalMonths);
        const totalLabel = tech.totalMonths
          ? `${years}y ${months}m`
          : "No duration found";

        return tech.jobs.map((job) => [
          `${tech.name} - ${totalLabel}`,
          job.company,
          job.start,
          job.end,
        ]);
      })
      .flat();

    return [
      ["Role", "Name", "Start", "End"],
      // @ts-ignore
      ...data,
    ];
  }, [filteredTechnologies]);

  const options = useMemo(() => {
    return {
      timeline: {
        ...defaultTimelineOptions,
        colorByRowLabel: false,
        // alternatingRowStyle: false,
        // avoidOverlappingGridLines: true,
      },
    };
  }, []);

  return (
    <ChartContainer title="Tech stack timeline">
      <FormControl>
        <FormLabel>
          <Checkbox
            checked={showKeyTechOnly}
            onChange={(e) => setShowKeyTechOnly(e.target.checked)}
            sx={{ marginRight: 1, borderColor: "neutral.outlinedBorder" }}
          />
          Show only key technologies (mentioned in skills section)
          <Tooltip title="Include only the technologies that the candidate explicitly mentioned in their skills section." />
        </FormLabel>
      </FormControl>
      <ScopeSelect
        label="Filter by Tech Scope"
        data={allTechnologies}
        selectedScope={selectedScope}
        onScopeChange={setSelectedScope}
      />

      <TimelineChart
        chartData={chartData}
        options={options}
        onChartIsReady={onChartIsReady}
      />
    </ChartContainer>
  );
};
