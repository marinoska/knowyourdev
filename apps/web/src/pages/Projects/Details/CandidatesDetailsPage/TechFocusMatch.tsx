import { BasePage } from "@/components/BasePage.tsx";
import Stack from "@mui/joy/Stack";
import { Box } from "@mui/joy";
import { Small, Title } from "@/components/typography.tsx";
import { Tooltip } from "@/components/Tooltip.tsx";
import { ActivityCard } from "@/pages/Projects/Details/CandidatesDetailsPage/ActivityCard.tsx";
import { SCOPE_NAMES, TProject } from "@kyd/common/api";
import { TTechFocusActivity } from "@/pages/Projects/Details/CandidatesDetailsPage/useTechFocusActivity.ts";

type TechFocusMatchProps = {
  project?: TProject;
  techFocusActivities: Record<string, TTechFocusActivity>;
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
