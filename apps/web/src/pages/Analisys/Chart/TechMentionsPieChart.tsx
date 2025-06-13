import { useMemo } from "react";
import { Chart } from "react-google-charts";
import { Typography } from "@mui/joy";
import { useChartContext } from "@/pages/Analisys/Chart/Core/ChartContext.ts";
import { TechProfile } from "@/api/query/types.ts";
import { Legend } from "@/components/Legend.tsx";
import {
  GreenLegendColor,
  PaleYellowLegendColor,
  SoftGrayColor,
  YellowLegendColor,
} from "@/utils/const.ts";
import { pieTooltip, tooltipField, tooltipOptions } from "@/utils/chart.ts";
import { ChartContainer } from "@/pages/Analisys/Chart/Components/ChartContainer.tsx";

const LegendItems = [
  {
    label: "In Skills & Jobs",
    color: GreenLegendColor,
    tooltipText:
      "Key technologies mentioned in both the CV's skills section and job descriptions.",
  },
  {
    label: "In Skills only",
    color: YellowLegendColor,
    tooltipText:
      "Technologies listed in the CV's skills section but not supported by references in the job descriptions.",
  },
  {
    label: "In Jobs only",
    color: SoftGrayColor,
    tooltipText:
      "Technologies mentioned in job descriptions but not currently used by the candidate.",
  },
];

export const TechMentionsPieChart = () => {
  const chartContext = useChartContext();

  const { chartData, sliceColors } = useMemo(() => {
    const technologies = (chartContext.profile?.technologies || []).sort(
      (a, b) => {
        return b.totalMonths - a.totalMonths;
      },
    );

    const inSkillsAndJobDescription: TechProfile[] = [];
    const inJobDescriptionOnly: TechProfile[] = [];
    const inSkillsOnly: TechProfile[] = [];
    for (const tech of technologies) {
      if (tech.inSkillsSection && tech.jobs.length) {
        inSkillsAndJobDescription.push(tech);
      } else if (tech.inSkillsSection) {
        inSkillsOnly.push(tech);
      } else {
        inJobDescriptionOnly.push(tech);
      }
    }

    const data: [string, number | string, string | typeof tooltipField][] = [
      ["Technology", "Percentage", tooltipField],
    ];
    const colors: string[] = [];

    const totalTechCount =
      inSkillsAndJobDescription.length +
      inJobDescriptionOnly.length +
      inSkillsOnly.length;
    const percent = (1 / totalTechCount) * 100;

    const addTechInDate = (tech: TechProfile, color: string) => {
      data.push([tech.name, percent, pieTooltip(tech)]);
      colors.push(color);
    };
    inSkillsAndJobDescription.forEach((tech) =>
      addTechInDate(tech, GreenLegendColor),
    );
    inSkillsOnly.forEach((tech) => addTechInDate(tech, PaleYellowLegendColor));
    inJobDescriptionOnly.forEach((tech) => addTechInDate(tech, SoftGrayColor));

    return { chartData: data, sliceColors: colors };
  }, [chartContext.profile?.technologies]);

  const options = useMemo(
    () => ({
      pieHole: 0.4, // Donut chart
      slices: sliceColors.map((color) => ({ color })), // Use the correct slice colors
      backgroundColor: "#fff",
      legend: { position: "right" },
      pieSliceText: "label",
      pieSliceTextStyle: {
        fontSize: 12, // Controls label font size
      },
      ...tooltipOptions,
    }),
    [sliceColors],
  );

  if (
    !chartContext.profile?.technologies ||
    chartContext.profile.technologies.length === 0
  ) {
    return (
      <Typography level="h4">No technologies available to display.</Typography>
    );
  }
  return (
    <ChartContainer
      title={"Technology mentions: skills section vs job descriptions"}
      tooltip="The chart categorizes technologies as: mentioned only in the skills section (not backed by job experience), mentioned only in job descriptions (not currently used by the candidate), or mentioned in both (key technologies)."
    >
      <Legend title={"Legend"} items={LegendItems} />

      {chartContext.profile?.jobs.length === 0 ? (
        <Typography>
          No data available to display the timeline chart.
        </Typography>
      ) : (
        <Chart
          chartType="PieChart"
          data={chartData}
          options={options}
          width="100%"
          height="600px"
          loader={<Typography>Loading Chart...</Typography>}
        />
      )}
    </ChartContainer>
  );
};
