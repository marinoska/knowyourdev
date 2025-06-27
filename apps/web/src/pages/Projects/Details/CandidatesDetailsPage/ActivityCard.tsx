import { Card, Typography, Box, LinearProgress, Tooltip } from "@mui/joy";
import Stack from "@mui/joy/Stack";
import { ColorPaletteProp } from "@mui/joy/styles";
import { Small, Subtitle } from "@/components/typography.tsx";
import { format } from "date-fns";
import { ScopePeriod } from "@/pages/Core/ResumeProfileContext.ts";
import { monthsToYearsAndMonths } from "@/utils/dates.ts";

type ActivityTypeProps = {
  scopeName: string;
  descNormalizedActivityScoreList: number[];
  descActivityPeriods: ScopePeriod[];
  totalActiveMonths: number;
  overallScore: number;
  color: ColorPaletteProp;
};

export const ActivityCard = ({
  scopeName,
  descNormalizedActivityScoreList,
  descActivityPeriods,
  totalActiveMonths,
  overallScore,
  color,
}: ActivityTypeProps) => {
  const hintList = descActivityPeriods.map(
    ({ totalMonths, endDate, startDate }) =>
      `${totalMonths} months within period ${format(startDate, "MM.yy")}-${format(endDate, "MM.yy")} `,
  );
  const pillsCaption =
    descActivityPeriods.length > 0
      ? `${descActivityPeriods[descActivityPeriods.length - 1].startDate.getFullYear()}-${descActivityPeriods[0].endDate.getFullYear()}`
      : "";

  const techNameArray = descActivityPeriods
    .map((period) => period.technologies.map((tech) => tech.name))
    .flat();
  const techNames = Array.from(new Set(techNameArray)).join(", ");

  const activeMonthsAndYears = monthsToYearsAndMonths(totalActiveMonths);
  console.log({ descNormalizedActivityScoreList });

  return (
    <Card variant="soft" color={color}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Subtitle color={color}>{scopeName}</Subtitle>
        <Typography fontWeight="lg" color={color}>
          {overallScore.toFixed(1)}%
        </Typography>
      </Stack>
      <LinearProgress
        determinate
        value={overallScore}
        color={color}
        variant="solid"
        size="sm"
      />
      <Stack
        direction="row"
        gap={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Small color={color}>Recent activity:</Small>
        <Small color={color}>
          {activeMonthsAndYears.years} years {activeMonthsAndYears.months}{" "}
          months active
        </Small>
      </Stack>
      <ActivityPills
        activityScoreList={descNormalizedActivityScoreList}
        hintList={hintList}
        text={pillsCaption}
        color={color}
      />

      <Small color={color}>Technologies: {techNames || "-"}</Small>
    </Card>
  );
};

const ActivityPills = ({
  activityScoreList,
  hintList,
  text,
  color,
}: {
  activityScoreList: number[];
  hintList: string[];
  text: string;
  color: ColorPaletteProp;
}) => {
  return (
    <Stack direction="row" gap={0.5} alignItems="center">
      {activityScoreList
        .map((value, index) => (
          <Tooltip key={index} title={hintList[index]} placement="top">
            <Box
              borderRadius={4}
              width={24}
              height={8}
              sx={{
                backgroundColor: getColorByValue(value, color),
              }}
            />
          </Tooltip>
        ))
        .reverse()}
      <Box ml={1}>
        <Small>{text}</Small>
      </Box>
    </Stack>
  );
};
// Simple color mapping for yearly bars
function getColorByValue(value: number, color: ColorPaletteProp): string {
  switch (color) {
    case "success":
      if (value >= 90) return "#1b873e";
      if (value >= 75) return "#2ca951";
      if (value >= 50) return "#49bd65";
      if (value >= 25) return "#a0e3c1";
      break;
    // return "#d5f5e3";

    case "primary":
      if (value >= 90) return "#0b6bc8";
      if (value >= 75) return "#1e88e5";
      if (value >= 50) return "#42a5f5";
      if (value >= 25) return "#90caf9";
      break;
    // return "#e3f2fd";

    case "warning":
      if (value >= 90) return "#bb4d00";
      if (value >= 75) return "#f57c00";
      if (value >= 50) return "#ffa726";
      if (value >= 25) return "#ffe082";
      break;
    // return "#fff3e0";

    case "danger":
      if (value >= 90) return "#b71c1c";
      if (value >= 75) return "#d32f2f";
      if (value >= 50) return "#ef5350";
      if (value >= 25) return "#ef9a9a";
      break;
    // return "#ffebee";

    case "neutral":
      if (value >= 90) return "#424242";
      if (value >= 75) return "#616161";
      if (value >= 50) return "#9e9e9e";
      if (value >= 25) return "#cfcfcf";
      break;
    // return "#f5f5f5";

    default:
      return "#e0e0e0"; // fallback
  }
  return "#e0e0e0"; // fallback
}
