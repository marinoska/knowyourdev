import { BasePage } from "@/components/BasePage.tsx";
import Stack from "@mui/joy/Stack";
import { Title } from "@/components/typography.tsx";
import { MatchDetailsRow } from "@/pages/Projects/Details/CandidatesDetailsPage/MatchDetailsRow.tsx";
import { TCandidateMatch } from "@/pages/Projects/Details/CandidatesDetailsPage/useCandidateMatch.ts";

type TOverallMatch = Pick<
  TCandidateMatch,
  "baselineJobDuration" | "averageJobDuration" | "jobStabilityScore"
>;
export const JobStability = ({ match }: { match: TOverallMatch }) => {
  const color =
    match.averageJobDuration < match.baselineJobDuration ? "danger" : "success";
  return (
    <BasePage.Sheet>
      <Stack direction="column" gap={0.5}>
        <Title text="Job stability" />
        <MatchDetailsRow
          value={`${match.baselineJobDuration} months`}
          color="neutral"
          text="Baseline Job Duration"
        />
        <MatchDetailsRow
          value={`${match.averageJobDuration} months`}
          color={color}
          text="Average Job Duration"
        />
        <MatchDetailsRow
          value={`${match.jobStabilityScore.toFixed(2)}%`}
          text="Fit"
          color={color}
        />
      </Stack>
    </BasePage.Sheet>
  );
};
