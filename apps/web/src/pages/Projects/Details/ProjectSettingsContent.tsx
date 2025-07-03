import Stack from "@mui/joy/Stack";
import Chip from "@mui/joy/Chip";
import { SCOPE_NAMES } from "@kyd/common/api";
import { Regular, Title } from "@/components/typography.tsx";
import { TProject } from "@/api/query/types.ts";

export const ProjectSettingsContent = ({ project }: { project: TProject }) => {
  return (
    <Stack gap={2}>
      <Title>Description</Title>
      <Regular>
        {project.settings?.description || "No description provided."}
      </Regular>

      <Title>Technical Focus</Title>
      <Stack direction="row" gap={1} flexWrap="wrap">
        {project.settings?.techFocus.map((tech) => (
          <Chip key={tech} variant="soft" color="primary" size="md">
            {SCOPE_NAMES[tech]}
          </Chip>
        ))}
      </Stack>

      <Title>Technologies</Title>
      <Stack direction="row" gap={1} flexWrap="wrap">
        {project.settings?.technologies && project.settings.technologies.length > 0 ? (
          project.settings.technologies.map((tech) => (
            <Chip key={tech.code} variant="soft" color="primary" size="md">
              {tech.name}
            </Chip>
          ))
        ) : (
          <Regular>No technologies specified.</Regular>
        )}
      </Stack>

      <Title>Baseline Job Duration</Title>
      <Regular>{project.settings?.baselineJobDuration} months</Regular>

      <Title>expectedRecentRelevantYears</Title>
      <Regular>{project.settings?.expectedRecentRelevantYears} years</Regular>
    </Stack>
  );
};

export default ProjectSettingsContent;
