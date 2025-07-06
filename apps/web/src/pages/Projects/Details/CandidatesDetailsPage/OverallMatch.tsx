import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { BasePage } from "@/components/BasePage.tsx";
import { Title } from "@/components/typography.tsx";
import { LinearProgress } from "@mui/joy";
import { MatchDetailsRow } from "./MatchDetailsRow.tsx";
import { TCandidateMatch } from "@/pages/Projects/Details/CandidatesDetailsPage/useCandidateMatch.ts";

type TOverallMatch = Pick<
  TCandidateMatch,
  "techFocusAvgScore" | "overallMatch"
>;

export const OverallMatch = ({ match }: { match: TOverallMatch }) => {
  return (
    <BasePage.Sheet>
      <Stack direction="column" gap={2}>
        <Title text="Overall tech match" />
        <Typography level="h2" color="success" width="100%" textAlign="center">
          {match.overallMatch.toFixed(2)}%
        </Typography>
        <LinearProgress variant="solid" size="lg" value={85} determinate />
        <Stack gap={0.5}>
          <MatchDetailsRow
            value={`${match.techFocusAvgScore.toFixed(2)}%`}
            text="Tech focus match"
            color="success"
          />
          <MatchDetailsRow
            value="90%"
            text="Key technologies Match"
            color="success"
          />
        </Stack>
      </Stack>
    </BasePage.Sheet>
  );
};
