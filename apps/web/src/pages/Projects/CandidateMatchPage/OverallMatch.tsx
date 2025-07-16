import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { BasePage } from "@/components/BasePage.tsx";
import { Title } from "@/components/typography.tsx";
import { LinearProgress } from "@mui/joy";
import { MatchDetailsRow } from "./MatchDetailsRow.tsx";
import { getScoreColor } from "@/utils/colors.ts";
import { TCandidateMatch } from "@kyd/common";

type TOverallMatch = Pick<
  TCandidateMatch,
  "techFocusAvgScore" | "techAvgScore" | "overallMatch"
>;

export const OverallMatch = ({ match }: { match: TOverallMatch }) => {
  return (
    <BasePage.Sheet>
      <Stack direction="column" gap={2}>
        <Title text="Overall tech match" />
        <Typography
          level="h2"
          color={getScoreColor(match.overallMatch)}
          width="100%"
          textAlign="center"
        >
          {match.overallMatch.toFixed(2)}%
        </Typography>
        <LinearProgress
          variant="solid"
          size="lg"
          value={85}
          determinate
          color={getScoreColor(match.overallMatch)}
        />
        <Stack gap={0.5}>
          <MatchDetailsRow
            value={`${match.techFocusAvgScore.toFixed(2)}%`}
            text="Tech focus match"
            color={getScoreColor(match.techFocusAvgScore)}
          />
          <MatchDetailsRow
            value={`${match.techAvgScore.toFixed(2)}%`}
            text="Key technologies Match"
            color={getScoreColor(match.techAvgScore)}
          />
        </Stack>
      </Stack>
    </BasePage.Sheet>
  );
};
