import { BasePage } from "@/components/BasePage.tsx";
import Stack from "@mui/joy/Stack";
import { Title } from "@/components/typography.tsx";
import { MatchDetailsRow } from "@/pages/Projects/CandidateMatchPage/MatchDetailsRow.tsx";
import { TCandidateMatch } from "@kyd/common/api";

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
          text="Expected Tenure"
        />
        <MatchDetailsRow
          value={`${match.averageJobDuration} months`}
          color={color}
          text="Average Job Duration"
        />
        <MatchDetailsRow
          value={`${match.jobStabilityScore.toFixed(2)}%`}
          text="Match"
          color={color}
        />
      </Stack>
    </BasePage.Sheet>
  );
};
