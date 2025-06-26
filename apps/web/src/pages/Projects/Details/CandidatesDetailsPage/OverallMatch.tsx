import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { BasePage } from "@/components/BasePage.tsx";
import { Title } from "@/components/typography.tsx";
import { LinearProgress } from "@mui/joy";
import { MatchDetailsRow } from "./MatchDetailsRow.tsx";

export const OverallMatch = () => {
  return (
    <BasePage.Sheet>
      <Stack direction="column" gap={2}>
        <Title text="Overall match" />
        <Typography level="h2" color="success" width="100%" textAlign="center">
          85%
        </Typography>
        <LinearProgress variant="solid" size="lg" value={85} determinate />
        <Stack gap={0.5}>
          <MatchDetailsRow value="85%" text="Skills Match" color="success" />
          <MatchDetailsRow
            value="90%"
            text="Experience Level"
            color="success"
          />
          <MatchDetailsRow value="95%" text="Job Stability" color="success" />
        </Stack>
      </Stack>
    </BasePage.Sheet>
  );
};
