import { BasePage } from "@/components/BasePage.tsx";
import Stack from "@mui/joy/Stack";
import { Box } from "@mui/joy";
import { Small, Title } from "@/components/typography.tsx";
import { Tooltip } from "@/components/Tooltip.tsx";
import { TProject } from "@kyd/common/api";
import { TTechMatch } from "@/pages/Projects/Details/CandidatesDetailsPage/useCandidateMatch.ts";
import { ColorPaletteProp } from "@mui/joy/styles";
import { ActivityCard } from "@/pages/Projects/Details/CandidatesDetailsPage/ActivityCard.tsx";

type TechMatchProps = {
  project?: TProject;
  techMatch: Record<string, TTechMatch>;
};

export const TechMatch = ({
  project,
  techMatch,
}: TechMatchProps) => {
  return (
    <BasePage.Sheet>
      <Stack gap={2}>
        <Box>
          <Title text={"Technology Match"} />
          <Small>
            Based on recent relevant experience (
            {project?.settings.expectedRecentRelevantYears} years)
            <Tooltip title={"You can change it in the project settings"} />
          </Small>
          <Small color="primary">
            Analyzed against {project?.name} project requirements
          </Small>
        </Box>
        {project?.settings.technologies.map((tech) => {
          const techActivity = techMatch[tech.code];

          if (!techActivity) return null;

          return (
            <ActivityCard
              key={tech.code}
              scopeName={tech.name}
              descActivityPeriods={techActivity.descActivityPeriods}
              descNormalizedActivityScoreList={techActivity.descNormalizedActivityScoreList}
              totalActiveMonths={techActivity.totalActiveMonths}
              overallScore={techActivity.overallScore}
              color={getScoreColor(techActivity.overallScore)}
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
