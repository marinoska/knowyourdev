import { useMemo } from "react";
import { useResumeProfileContext } from "@/pages/Core/ResumeProfileContext.ts";
import { GreenLegendColor, YellowLegendColor } from "@/utils/const";
import { RedLegendColor } from "@/utils/const.ts";
import { Legend } from "@/components/Legend.tsx";
import { ChartContainer } from "@/pages/components/Chart/ChartContainer.tsx";
import { defaultTimelineOptions } from "@/utils/chart.ts";
import { TimelineChart } from "@/pages/components/Chart/TimelineChart.tsx";

const LegendItems = [
  { label: "Software Development Jobs", color: GreenLegendColor },
  { label: "Gaps", color: YellowLegendColor },
  { label: "Irrelevant Jobs (not in development)", color: RedLegendColor },
];

export const CareerTimelineChart = () => {
  const chartContext = useResumeProfileContext();

  const chartData = useMemo(() => {
    chartContext.jobGaps;

    const gapsAndJobs = [
      ...chartContext.jobGaps,
      ...chartContext.irrelevantJobs,
      ...chartContext.softwareDevelopmentJobs,
    ];
    const data = gapsAndJobs.map((job) => {
      const role = job.role || "Undefined Role";
      const company = job.job || "Undefined Name";

      return [role, company, job.start, job.end, "Promotion to Senior"];
    });

    return [
      [
        "Role",
        "Name",
        "Start Date",
        "End Date",
        { type: "string", role: "annotation" },
      ],
      ...data,
    ];
  }, [
    chartContext.irrelevantJobs,
    chartContext.jobGaps,
    chartContext.softwareDevelopmentJobs,
  ]);

  const options = useMemo(() => {
    const irrelevantJobsRowsCount = new Set(
      chartContext.irrelevantJobs.map((job) => job.role),
    ).size;
    const softwareJobsRowsCount = new Set(
      chartContext.softwareDevelopmentJobs.map((job) => job.role),
    ).size;

    const firstGapsColor = chartContext.jobGaps.length
      ? [YellowLegendColor]
      : [];
    return {
      colors: [
        ...firstGapsColor, // Gaps color (first row)
        ...Array(irrelevantJobsRowsCount).fill(RedLegendColor), // irrelevant jobs color
        ...Array(softwareJobsRowsCount).fill(GreenLegendColor),
      ],
      timeline: defaultTimelineOptions,
    };
  }, [
    chartContext.irrelevantJobs,
    chartContext.jobGaps.length,
    chartContext.softwareDevelopmentJobs,
  ]);

  return (
    <ChartContainer title={"Career Timeline"}>
      <Legend title={"Legend"} items={LegendItems} />

      <TimelineChart chartData={chartData} options={options} />
    </ChartContainer>
  );
};
