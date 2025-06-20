import { useMemo } from "react";
import { useResumeProfileContext } from "@/pages/Core/ResumeProfileContext.ts";
import { RedLegendColor } from "@/utils/const";
import { GreenLegendColor } from "@/utils/const.ts";
import { Legend } from "@/components/Legend.tsx";
import { ChartContainer } from "@/pages/components/Chart/ChartContainer.tsx";
import { defaultTimelineOptions } from "@/utils/chart.ts";
import { TimelineChart } from "@/pages/components/Chart/TimelineChart.tsx";

const LegendItems = [
  { label: "Tech stack specified", color: GreenLegendColor },
  { label: "Missing or unrecognized Tech Stack", color: RedLegendColor },
];

export const CareerTechTimelineChart = () => {
  const chartContext = useResumeProfileContext();

  const chartData = useMemo(() => {
    const missingTechJobsData = chartContext.jobsWithMissingTech.map((job) => {
      return [
        job.role || "Undefined role",
        "No tech specified",
        job.start,
        job.end,
      ];
    });

    const jobsData = chartContext.jobsWithFilledTech.map((job) => {
      const techList = job.technologies.map(
        (tech: { name: string }) => tech.name,
      );

      return [
        job.role || "Undefined role",
        techList.join(","),
        job.start,
        job.end,
      ];
    });

    return [
      ["Role", "Tech", "Start Date", "End Date"],
      ...missingTechJobsData,
      ...jobsData,
    ];
  }, [chartContext.jobsWithFilledTech, chartContext.jobsWithMissingTech]);

  const missingTechJobsRowCount = new Set(
    chartContext.jobsWithMissingTech.map((job) => job.job),
  ).size;
  const jobsWithFilledTechRowCount = new Set(
    chartContext.jobsWithFilledTech.map((job) => job.job),
  ).size;

  const options = useMemo(() => {
    return {
      colors: [
        ...Array(missingTechJobsRowCount).fill(RedLegendColor), // irrelevant jobs color
        ...Array(jobsWithFilledTechRowCount).fill(GreenLegendColor),
      ],
      timeline: defaultTimelineOptions,
    };
  }, [jobsWithFilledTechRowCount, missingTechJobsRowCount]);

  return (
    <ChartContainer
      title="Career Tech Timeline"
      tooltip="Tech timeline displays the roles and their associated technologies over time, based on job descriptions provided by the candidate."
    >
      <Legend title={"Legend"} items={LegendItems} />
      <TimelineChart chartData={chartData} options={options} />
    </ChartContainer>
  );
};
// TODO hints for legend
