import { Card, Typography, Box, LinearProgress, Tooltip } from "@mui/joy";
import Stack from "@mui/joy/Stack";
import { TScopeActivity } from "@/pages/Core/ResumeProfileContext.ts";
import { useTechFocusActivity } from "./useTechFocusActivity";
import { ColorPaletteProp } from "@mui/joy/styles";
import { Small, Subtitle } from "@/components/typography.tsx";

type ActivityTypeProps = {
  scope: string;
  scopeActivity: TScopeActivity;
  expectedRecentRelevantYears: number;
};

export const ActivityCard = ({
  scope,
  scopeActivity,
  expectedRecentRelevantYears,
}: ActivityTypeProps) => {
  const {
    normalizedActivityList,
    hintList,
    pillsCaption,
    techNames,
    activeMonthsAndYears,
    overallScore,
    color,
  } = useTechFocusActivity({
    scopeActivity,
    expectedRecentRelevantYears,
    order: "desc",
  });

  return (
    <Card variant="soft" color={color}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Subtitle color={color}>{scope}</Subtitle>
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
        normalizedActivityList={normalizedActivityList}
        hintList={hintList}
        text={pillsCaption}
        color={color}
      />

      <Small color={color}>Technologies: {techNames || "-"}</Small>
    </Card>
  );
};

const ActivityPills = ({
  normalizedActivityList,
  hintList,
  text,
  color,
}: {
  normalizedActivityList: number[];
  hintList: string[];
  text: string;
  color: ColorPaletteProp;
}) => {
  return (
    <Stack direction="row" gap={0.5} alignItems="center">
      {normalizedActivityList.map((value, index) => (
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
      ))}
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
