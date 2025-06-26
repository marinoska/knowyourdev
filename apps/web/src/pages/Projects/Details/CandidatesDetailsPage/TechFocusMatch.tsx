import { useResumeProfileContext } from "@/pages/Core/ResumeProfileContext.ts";
import { BasePage } from "@/components/BasePage.tsx";
import Stack from "@mui/joy/Stack";
import { Box } from "@mui/joy";
import { Small, Title } from "@/components/typography.tsx";
import { Tooltip } from "@/components/Tooltip.tsx";
import { ActivityCard } from "@/pages/Projects/Details/CandidatesDetailsPage/ActivityCard.tsx";
import { SCOPE_NAMES, TProject } from "@kyd/common/api";

type TechFocusMatchProps = {
  project?: TProject;
};

export const TechFocusMatch = ({ project }: TechFocusMatchProps) => {
  const { scopes } = useResumeProfileContext();

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
        {project?.settings.techFocus.map((scope) => (
          <ActivityCard
            scope={SCOPE_NAMES[scope]}
            scopeActivity={scopes[scope]}
            expectedRecentRelevantYears={
              project.settings.expectedRecentRelevantYears
            }
          />
        ))}
      </Stack>
    </BasePage.Sheet>
  );
};
