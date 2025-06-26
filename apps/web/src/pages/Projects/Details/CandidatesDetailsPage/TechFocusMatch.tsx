import { useResumeProfileContext } from "@/pages/Core/ResumeProfileContext.ts";
import { BasePage } from "@/components/BasePage.tsx";
import Stack from "@mui/joy/Stack";
import { Box } from "@mui/joy";
import { Small, Title } from "@/components/typography.tsx";
import { Tooltip } from "@/components/Tooltip.tsx";
import { ActivityCard } from "@/pages/Projects/Details/CandidatesDetailsPage/ActivityCard.tsx";
import { SCOPE_NAMES, TProject } from "@kyd/common/api";
import { useTechFocusActivity } from "./useTechFocusActivity";

type TechFocusMatchProps = {
  project?: TProject;
};

export const TechFocusMatch = ({ project }: TechFocusMatchProps) => {
  const { scopes: candidateScopes } = useResumeProfileContext();

  const techFocusActivities = useTechFocusActivity({
    candidateScopes,
    scopeCodes: project?.settings.techFocus || [],
    expectedRecentRelevantYears:
      project?.settings.expectedRecentRelevantYears || 0,
    order: "desc",
  });

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
              normalizedActivityList={techFocusActivity.normalizedActivityList}
              hintList={techFocusActivity.hintList}
              pillsCaption={techFocusActivity.pillsCaption}
              techNames={techFocusActivity.techNames}
              activeMonthsAndYears={techFocusActivity.activeMonthsAndYears}
              overallScore={techFocusActivity.overallScore}
              color={techFocusActivity.color}
            />
          );
        })}
      </Stack>
    </BasePage.Sheet>
  );
};
