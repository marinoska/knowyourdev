import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import { SCOPE_NAMES, ProjectsItem } from "@kyd/common/api";
import { BasePage } from "@/components/BasePage.tsx";

export const ProjectSettingsContent = ({
  profile,
}: {
  profile: ProjectsItem;
}) => {
  return (
    <BasePage.Content>
      <Stack gap={2}>
        <Typography component="h5">Description</Typography>
        <Typography>
          {profile.settings?.description || "No description provided."}
        </Typography>

        <Typography component="h5">Technical Focus</Typography>
        <Stack direction="row" gap={1} flexWrap="wrap">
          {profile.settings?.techFocus.map((tech) => (
            <Chip key={tech} variant="soft" color="primary" size="md">
              {SCOPE_NAMES[tech]}
            </Chip>
          ))}
        </Stack>

        <Typography component="h5">Baseline Job Duration</Typography>
        <Typography>{profile.settings?.baselineJobDuration} months</Typography>
      </Stack>
    </BasePage.Content>
  );
};

export default ProjectSettingsContent;
