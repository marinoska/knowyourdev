import { Card, Typography, Box, LinearProgress } from "@mui/joy";
import Stack from "@mui/joy/Stack";

export const FrontendActivityCard = ({
  color,
}: {
  color: "success" | "warning";
}) => {
  const activityPerYear = [90, 85, 75, 60, 0]; // recent activity per year
  const totalActiveYears = 4.5;
  const overallScore = 95;

  return (
    <Card variant="outlined" color={color}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography level="body-md" fontWeight="md" color={color}>
          Frontend
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
        <ActivityPills activityPerYear={activityPerYear} text={"2019–2024"} />
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
  activityPerYear,
  text,
}: {
  activityPerYear: number[];
  text: string;
}) => {
  return (
    <Stack direction="row" gap={0.5} alignItems="center">
      {activityPerYear.map((value, index) => (
        <Box
          key={index}
          borderRadius={4}
          width={24}
          height={8}
          sx={{
            backgroundColor: getColorByValue(value),
          }}
        />
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
