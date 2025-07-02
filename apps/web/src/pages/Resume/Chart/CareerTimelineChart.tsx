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
  const { profile } = useResumeProfileContext();

  const chartData = useMemo(() => {
    const gapsAndJobs = [
      ...profile.jobGaps,
      ...profile.irrelevantJobs,
      ...profile.softwareDevelopmentJobs,
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
    profile.irrelevantJobs,
    profile.jobGaps,
    profile.softwareDevelopmentJobs,
  ]);

  const options = useMemo(() => {
    const irrelevantJobsRowsCount = new Set(
      profile.irrelevantJobs.map((job) => job.role),
    ).size;
    const softwareJobsRowsCount = new Set(
      profile.softwareDevelopmentJobs.map((job) => job.role),
    ).size;

    const firstGapsColor = profile.jobGaps.length ? [YellowLegendColor] : [];
    return {
      colors: [
        ...firstGapsColor, // Gaps color (first row)
        ...Array(irrelevantJobsRowsCount).fill(RedLegendColor), // irrelevant jobs color
        ...Array(softwareJobsRowsCount).fill(GreenLegendColor),
      ],
      timeline: defaultTimelineOptions,
    };
  }, [
    profile.irrelevantJobs,
    profile.jobGaps.length,
    profile.softwareDevelopmentJobs,
  ]);

  return (
    <ChartContainer title={"Career Timeline"}>
      <Legend title={"Legend"} items={LegendItems} />

      <TimelineChart chartData={chartData} options={options} />
    </ChartContainer>
  );
};
