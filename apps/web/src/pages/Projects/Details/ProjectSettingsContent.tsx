import Stack from "@mui/joy/Stack";
import Chip from "@mui/joy/Chip";
import { SCOPE_NAMES } from "@kyd/common/api";
import { Regular, Small, Subtitle } from "@/components/typography.tsx";
import { TProjectDTO } from "@/api/query/types.ts";
import {
  Alert,
  Card,
  FormLabel,
  IconButton,
  Input,
  Slider,
  Textarea,
} from "@mui/joy";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningIcon from "@mui/icons-material/Warning";

export const ProjectSettingsContent = ({
  project,
}: {
  project: TProjectDTO;
}) => {
  return (
    <Stack gap={2} direction="row" flexWrap="wrap" pt={1}>
      <Stack flex={1} gap={2}>
        <Stack gap={1}>
          <FormLabel id="project-name-label" htmlFor="project-name" required>
            Project name
          </FormLabel>
          <Input
            id="project-name"
            required
            placeholder="e.g., John Smith - Senior Developer"
            value={project.name}
            onChange={() => null}
          />
        </Stack>
        <Stack gap={1}>
          <FormLabel
            id="role-description-label"
            htmlFor="role-description"
            required
          >
            Description
          </FormLabel>
          <Textarea
            id="role-description"
            minRows={10}
            required
            size="sm"
            value={project.settings.description}
            onChange={() => null}
          />
        </Stack>

        <Card size="lg" variant="soft">
          <Stack
            direction="row"
            gap={1}
            alignItems="center"
            flexWrap="nowrap"
            justifyContent="space-between"
          >
            <FormLabel
              id="baseline-job-duration-label"
              htmlFor="baseline-job-duration"
              required
            >
              Baseline job duration
            </FormLabel>
            <Subtitle>{project.settings?.baselineJobDuration} months</Subtitle>
          </Stack>
          <Slider
            id="baseline-job-duration"
            min={1}
            max={36}
            defaultValue={18}
            value={project.settings?.baselineJobDuration}
            step={1}
            marks
            valueLabelDisplay="on"
          />
        </Card>
        <Card size="lg" variant="soft">
          <Stack
            direction="row"
            gap={1}
            alignItems="center"
            flexWrap="nowrap"
            justifyContent="space-between"
          >
            <FormLabel
              id="expected-recent-relevant-years-label"
              htmlFor="expected-recent-relevant-years"
              required
            >
              Expected recent relevant years
            </FormLabel>
            <Subtitle>
              {project.settings?.expectedRecentRelevantYears} years
            </Subtitle>
          </Stack>
          <Slider
            id="expected-recent-relevant-years"
            min={1}
            max={5}
            defaultValue={3}
            value={project.settings?.expectedRecentRelevantYears}
            step={1}
            marks
            valueLabelDisplay="on"
          />
        </Card>
      </Stack>
      <Stack flex={1} gap={2}>
        <Card size="lg" variant="soft">
          <Stack>
            <Subtitle>System-Generated Parameters</Subtitle>
            <Small color="neutral">
              These parameters are automatically generated based on your role
              description
            </Small>
          </Stack>
          <Stack>
            <Alert
              startDecorator={<WarningIcon />}
              color="warning"
              sx={{ my: 2 }}
            >
              <Small>
                Out of sync — your role description has changed. Re-generate to
                refresh settings.
              </Small>
            </Alert>
            <Stack direction="row" alignItems="center">
              <IconButton size="md" color="success" variant="plain">
                <Stack
                  direction="row"
                  gap={1}
                  alignItems="center"
                  flexWrap="nowrap"
                >
                  <RefreshIcon />
                  <Subtitle color="success">Re-generate all settings</Subtitle>
                </Stack>
              </IconButton>
            </Stack>
          </Stack>
          <Small>Technical Focus</Small>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {project.settings?.techFocus.map((tech) => (
              <Chip key={tech} variant="soft" color="primary" size="md">
                {SCOPE_NAMES[tech]}
              </Chip>
            ))}
          </Stack>

          <Small>Technologies</Small>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {project.settings?.technologies &&
            project.settings.technologies.length > 0 ? (
              project.settings.technologies.map((tech) => (
                <Chip key={tech.code} variant="soft" color="primary" size="md">
                  {tech.name}
                </Chip>
              ))
            ) : (
              <Regular>No technologies specified.</Regular>
            )}
          </Stack>
        </Card>
      </Stack>
    </Stack>
  );
};

export default ProjectSettingsContent;
