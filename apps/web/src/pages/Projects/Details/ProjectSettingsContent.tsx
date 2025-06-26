import Stack from "@mui/joy/Stack";
import Chip from "@mui/joy/Chip";
import { SCOPE_NAMES, TProjectsItem } from "@kyd/common/api";
import { Regular, Title } from "@/components/typography.tsx";

export const ProjectSettingsContent = ({
  profile,
}: {
  profile: TProjectsItem;
}) => {
  return (
    <Stack gap={2}>
      <Title>Description</Title>
      <Regular>
        {profile.settings?.description || "No description provided."}
      </Regular>

      <Title>Technical Focus</Title>
      <Stack direction="row" gap={1} flexWrap="wrap">
        {profile.settings?.techFocus.map((tech) => (
          <Chip key={tech} variant="soft" color="primary" size="md">
            {SCOPE_NAMES[tech]}
          </Chip>
        ))}
      </Stack>

      <Title>Baseline Job Duration</Title>
      <Regular>{profile.settings?.baselineJobDuration} months</Regular>

      <Title>expectedRecentRelevantYears</Title>
      <Regular>{profile.settings?.expectedRecentRelevantYears} years</Regular>
    </Stack>
  );
};

export default ProjectSettingsContent;
