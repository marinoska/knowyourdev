import { BasePage } from "@/components/BasePage.tsx";
import Stack from "@mui/joy/Stack";
import { Box } from "@mui/joy";
import { Small, Title } from "@/components/typography.tsx";
import { Tooltip } from "@/components/Tooltip.tsx";
import { ActivityCard } from "@/pages/Projects/Details/CandidatesDetailsPage/ActivityCard.tsx";
import { SCOPE_NAMES, TProject } from "@kyd/common/api";
import { TTechFocusMatch } from "@/pages/Projects/Details/CandidatesDetailsPage/useCandidateMatch.ts";
import { ColorPaletteProp } from "@mui/joy/styles";

type TechFocusMatchProps = {
  project?: TProject;
  techFocusActivities: Record<string, TTechFocusMatch>;
};

export const TechFocusMatch = ({
  project,
  techFocusActivities,
}: TechFocusMatchProps) => {
  return (
    <BasePage.Sheet>
      <Stack gap={2}>
        <Box>
          <Title text={"Tech Focus Match"} />
          <Small>
            Based on recent relevant experience (
            {project?.settings.expectedRecentRelevantYears} years)
            <Tooltip title={"You can change it in the project settings"} />
          </Small>
          <Small color="primary">
            Analyzed against {project?.name} project requirements
          </Small>
        </Box>
        {project?.settings.techFocus.map((scope) => {
          const techFocusActivity = techFocusActivities[scope];

          return (
            <ActivityCard
              key={scope}
              scopeName={SCOPE_NAMES[scope]}
              descActivityPeriods={techFocusActivity.descActivityPeriods}
              descNormalizedActivityScoreList={
                techFocusActivity.descNormalizedActivityScoreList
              }
              totalActiveMonths={techFocusActivity.totalActiveMonths}
              overallScore={techFocusActivity.overallScore}
              color={getScoreColor(techFocusActivity.overallScore)}
            />
          );
        })}
      </Stack>
    </BasePage.Sheet>
  );
};

const getScoreColor = (score: number): ColorPaletteProp => {
  if (score >= 85) return "success";
  if (score >= 65) return "primary";
  if (score >= 45) return "warning";
  if (score >= 25) return "neutral";
  return "danger";
};
