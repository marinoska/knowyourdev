import { Card, Typography, Box, LinearProgress, Tooltip } from "@mui/joy";
import Stack from "@mui/joy/Stack";
import { TScopeActivity } from "@/pages/Core/ResumeProfileContext.ts";

type ActivityTypeProps = {
  color: "success" | "warning";
  scope: string;
  scopeActivity?: TScopeActivity;
  baselineExperienceYears: number;
};
export const ActivityCard = ({
  color,
  scope,
  scopeActivity,
  baselineExperienceYears,
}: ActivityTypeProps) => {
  const lastPeriods =
    scopeActivity?.periods.slice(0, baselineExperienceYears) || [];
  const paddedPeriodList = lastPeriods
    .reverse()
    .concat(
      Array(Math.max(0, baselineExperienceYears - lastPeriods.length)).fill(0),
    );
  const normalizedActivityList = paddedPeriodList.map(
    ({ totalMonths }) => (totalMonths * 100) / 12,
  );
  const rawActivityList = paddedPeriodList.map(
    ({ totalMonths }) => totalMonths,
  );

  console.log({
    lastPeriods,
    normalizedActivityList,
    rawActivityList,
    baselineExperienceYears,
  });
  const totalActiveYears = 4.5;
  const overallScore = 95;

  return (
    <Card variant="soft" color={color}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography level="body-md" fontWeight="md" color={color}>
          {scope}
        </Typography>
        <Typography level="body-md" fontWeight="lg" color={color}>
          {overallScore}%
        </Typography>
      </Stack>

      <LinearProgress
        determinate
        value={overallScore}
        color={color}
        variant="solid"
        size="sm"
      />
      <Stack>
        <Typography level="body-sm" color={color}>
          Recent activity:
        </Typography>
        <ActivityPills
          normalizedActivityList={normalizedActivityList}
          rawActivityList={rawActivityList}
          text={"2019–2024"}
        />
        <Typography level="body-sm" fontWeight="md" color={color}>
          {totalActiveYears} years active
        </Typography>
      </Stack>

      <Typography level="body-sm" color={color} fontWeight="md">
        Strong match: React, TypeScript, modern frontend tools TODO
      </Typography>
    </Card>
  );
};

const ActivityPills = ({
  normalizedActivityList,
  rawActivityList,
  text,
}: {
  normalizedActivityList: number[];
  rawActivityList: number[];
  text: string;
}) => {
  return (
    <Stack direction="row" gap={0.5} alignItems="center">
      {normalizedActivityList.map((value, index) => (
        <Tooltip
          key={index}
          title={`${rawActivityList[index]} months`}
          placement="top"
        >
          <Box
            borderRadius={4}
            width={24}
            height={8}
            sx={{
              backgroundColor: getColorByValue(value),
            }}
          />
        </Tooltip>
      ))}
      <Typography level="body-sm" ml={1}>
        {text}
      </Typography>
    </Stack>
  );
};
// Simple color mapping for yearly bars
function getColorByValue(value: number): string {
  if (value >= 90) return "#1b873e";
  if (value >= 75) return "#2ca951";
  if (value >= 50) return "#49bd65";
  if (value >= 25) return "#a0e3c1";
  return "#e0e0e0";
}
