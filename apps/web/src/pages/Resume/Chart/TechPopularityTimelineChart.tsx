import { useFilteredTechnologies } from "@/pages/Resume/Chart/Core/useFilteredTechnologies.ts";
import { useCallback, useEffect, useMemo } from "react";
import { ChartContainer } from "@/pages/Resume/Chart/Components/ChartContainer.tsx";
import { ScopeSelect } from "@/pages/Resume/Chart/Components/ScopeSelect.tsx";
import { TimelineChart } from "@/pages/Resume/Chart/Components/TimelineChart.tsx";
import { defaultTimelineOptions } from "@/utils/chart.ts";
import { TREND_MAP, TrendType } from "@kyd/common/api";
import { TechProfile } from "@/api/query/types.ts";
import Typography from "@mui/joy/Typography";
import {
  DeepGreenLegendColor,
  GreenLegendColor,
  NiceBlue,
  RedLegendColor,
  YellowLegendColor,
} from "@/utils/const.ts";

const PopularityMapping: Record<number, string> = {
  15: "Uncommon",
  30: "Less popular",
  50: "Moderately popular",
  80: "Very popular",
  100: "Extremely popular",
} as const;

const TrendMapping: Record<TrendType, string> = {
  SD: "Strong declining",
  D: "Declining",
  S: "Steady",
  T: "Trending",
  HT: "Highly trending",
} as const;

const Colors = [
  RedLegendColor,
  YellowLegendColor,
  NiceBlue,
  GreenLegendColor,
  DeepGreenLegendColor,
];
const PopularityColors = Object.values(PopularityMapping).reduce(
  (acc, label, index) => {
    return { ...acc, [label]: Colors[index] };
  },
  {},
);
const TrendColors = Object.values(TrendMapping).reduce((acc, label, index) => {
  return { ...acc, [label]: Colors[index] };
}, {});

const getPopularityLabel = (popularity: number) => {
  for (const limit of Object.keys(PopularityMapping).map(Number)) {
    if (popularity <= limit) {
      const label = PopularityMapping[limit];
      // @ts-ignore
      return { label, color: PopularityColors[label] };
    }
  }
};

const sortByPopularity = (a: TechProfile, b: TechProfile) =>
  b.popularity - a.popularity;
const getTrendLabel = (trend: TrendType) => {
  const label = TrendMapping[trend];
  // @ts-ignore
  return { label, color: TrendColors[label] };
};
const sortByTrend = (a: TechProfile, b: TechProfile) => {
  if (TREND_MAP[a.trend] === TREND_MAP[b.trend]) return 0;
  return TREND_MAP[a.trend] < TREND_MAP[b.trend] ? 1 : -1;
};

export const TechPopularityTimelineChart = () => {
  const {
    allTechnologies,
    filteredTechnologies,
    selectedScope,
    setSelectedScope,
    setShowKeyTechOnly,
  } = useFilteredTechnologies();

  useEffect(() => {
    setShowKeyTechOnly(true);
  }, [setShowKeyTechOnly]);

  const createChartData = useCallback(
    ({ fieldName }: { fieldName: "popularity" | "trend" }) => {
      const getLabelFn =
        fieldName === "popularity" ? getPopularityLabel : getTrendLabel;
      const sortFn =
        fieldName === "popularity" ? sortByPopularity : sortByTrend;
      if (!filteredTechnologies?.length) {
        return { chartData: [], colors: [] };
      }

      const colorsSet = new Set<string>();
      const data = filteredTechnologies
        .sort(sortFn)
        .map((tech) => {
          // @ts-ignore
          const { label, color } = getLabelFn(tech[fieldName]);
          colorsSet.add(color);
          console.log(label, color);
          return tech.jobs.map((job) => [label, tech.name, job.start, job.end]);
        })
        .flat();

      // colors in the correct order
      const colors = Array.from(colorsSet);

      return {
        chartData: [["fieldName", "Tech", "Start", "End"], ...(data ?? [])],
        colors,
      };
    },
    [filteredTechnologies],
  );

  const [popChartData, trendChartData, popColors, trendColors] = useMemo(() => {
    const { chartData: popChartData, colors: popColors } = createChartData({
      fieldName: "popularity",
    });
    const { chartData: trendChartData, colors: trendColors } = createChartData({
      fieldName: "trend",
    });
    return [popChartData, trendChartData, popColors, trendColors];
  }, [createChartData]);

  const options = useMemo(() => {
    return {
      timeline: {
        ...defaultTimelineOptions,
      },
    };
  }, []);

  return (
    <ChartContainer title="Key tech popularity timeline">
      <ScopeSelect
        label="Filter by Tech Scope"
        data={allTechnologies}
        selectedScope={selectedScope}
        onScopeChange={setSelectedScope}
        sx={{ width: 200 }}
      />

      <Typography level="h4">World usage</Typography>
      <TimelineChart
        chartData={popChartData}
        options={{ ...options, colors: popColors }}
      />
      <Typography level="h4">Trends</Typography>
      <TimelineChart
        chartData={trendChartData}
        options={{ ...options, colors: trendColors }}
      />
    </ChartContainer>
  );
};
