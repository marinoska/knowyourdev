import { useMemo } from "react";
import { Chart } from "react-google-charts";
import { Typography } from "@mui/joy";
import { TechProfile, TResumeProfileDTO } from "@/api/query/types.ts";
import { Legend } from "@/components/Legend.tsx";
import { GreenLegendColor, SoftGrayColor } from "@/utils/const.ts";
import { pieTooltip, tooltipField } from "@/utils/chart.ts";
import { monthsToYearsAndMonths } from "@/utils/dates.ts";
import { ChartContainer } from "@/pages/components/Chart/ChartContainer.tsx";
import { Regular } from "@/components/typography.tsx";

const LegendItems = [
  {
    label: "Key technologies",
    color: GreenLegendColor,
    tooltipText:
      "Key technologies mentioned in both the CV's skills section and job descriptions.",
  },
  {
    label: "Previously used technologies",
    color: SoftGrayColor,
    tooltipText:
      "Technologies mentioned in job descriptions but not currently used by the candidate (not in the skills list).",
  },
];

export const TechDurationPieChart = ({ profile }: { profile: TResumeProfileDTO }) => {

  const { chartData, sliceColors } = useMemo(() => {
    const technologies = (profile?.technologies || []).sort(
      (a, b) => {
        return b.totalMonths - a.totalMonths;
      },
    );

    const inSkills: TechProfile[] = [];
    const notInSkills: TechProfile[] = [];
    for (const tech of technologies) {
      tech.inSkillsSection ? inSkills.push(tech) : notInSkills.push(tech);
    }

    const data: [string, number | string, string | typeof tooltipField][] = [
      ["Technology", "Months", tooltipField],
    ];
    const colors: string[] = [];

    [...inSkills, ...notInSkills].forEach((tech) => {
      const { years, months } = monthsToYearsAndMonths(tech.totalMonths);
      data.push([
        `${tech.name}, ${years}y ${months}m`,
        tech.totalMonths,
        pieTooltip(tech),
      ]);
      colors.push(tech.inSkillsSection ? GreenLegendColor : SoftGrayColor); // Green if In Skills, Red otherwise
    });

    return { chartData: data, sliceColors: colors };
  }, [profile?.technologies]);

  // Chart options
  const options = useMemo(
    () => ({
      pieHole: 0.4, // Donut chart
      slices: sliceColors.map((color) => ({ color })), // Use the correct slice colors
      backgroundColor: "#fff",
      legend: { position: "right" },
      pieSliceText: "label",
      pieSliceTextStyle: {
        fontSize: 10, // Controls label font size
      },
      tooltip: {
        trigger: "focus", // Tooltip appears on hover
        isHtml: true, // Enables HTML tooltips for custom content
      },
    }),
    [sliceColors],
  );

  if (
    !profile?.technologies ||
    profile.technologies.length === 0
  ) {
    return (
      <Typography level="h4">No technologies available to display.</Typography>
    );
  }

  return (
    <ChartContainer
      title="Technologies by duration"
      tooltip="Displays the total time spent on each technology based on the durations clearly mentioned by the user in their job descriptions."
    >
      <Legend title={"Legend"} items={LegendItems} />

      {profile?.jobs.length === 0 ? (
        <Regular>No data available to display the timeline chart.</Regular>
      ) : (
        <Chart
          chartType="PieChart"
          data={chartData}
          options={options}
          width="100%"
          height="600px"
          loader={<Regular>Loading Chart...</Regular>}
        />
      )}
    </ChartContainer>
  );
};
