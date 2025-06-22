import { Card, Typography, Box, LinearProgress } from "@mui/joy";
import Stack from "@mui/joy/Stack";

type ActivityTypeProps = { color: "success" | "warning"; scope: string };
export const ActivityCard = ({ color, scope }: ActivityTypeProps) => {
  const activityPerYear = [90, 85, 75, 60, 0]; // recent activity per year
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
        <ActivityPills activityLevels={activityPerYear} text={"2019–2024"} />
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
  activityLevels,
  text,
}: {
  activityLevels: number[];
  text: string;
}) => {
  return (
    <Stack direction="row" gap={0.5} alignItems="center">
      {activityLevels.map((value, index) => (
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
