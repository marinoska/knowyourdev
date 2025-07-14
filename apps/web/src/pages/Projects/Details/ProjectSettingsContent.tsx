import Stack from "@mui/joy/Stack";
import Chip from "@mui/joy/Chip";
import { SCOPE_NAMES } from "@kyd/common/api";
import { Regular, Small, Subtitle } from "@/components/typography.tsx";
import { TProjectDTO } from "@/api/query/types.ts";
import {
  Alert,
  Button,
  Card,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Slider,
  Textarea,
} from "@mui/joy";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningIcon from "@mui/icons-material/Warning";
import { useForm, Controller, SubmitHandler, Control } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { useProjectUpdateMutation } from "@/api/query/useProjectUpdateMutation";
import { Snackbar } from "@/components/Snackbar.tsx";

type ProjectFormValues = {
  name: string;
  settings: {
    description: string;
    baselineJobDuration: number;
    expectedRecentRelevantYears: number;
  };
};

const MAX_BASELINE_DURATION = 36;
const MIN_BASELINE_DURATION = 1;
const MAX_EXPECTED_DURATION = 7;
const MIN_EXPECTED_DURATION = 1;

const validationSchema = yup.object({
  name: yup.string().required("Project name is required"),
  settings: yup.object({
    description: yup.string().required("Description is required"),
    baselineJobDuration: yup
      .number()
      .required("Baseline job duration is required")
      .min(
        MIN_BASELINE_DURATION,
        `Minimum duration is ${MIN_BASELINE_DURATION} month`,
      )
      .max(
        MAX_BASELINE_DURATION,
        `Maximum duration is ${MAX_BASELINE_DURATION} months`,
      ),
    expectedRecentRelevantYears: yup
      .number()
      .required("Expected recent relevant years is required")
      .min(MIN_EXPECTED_DURATION, `Minimum years is ${MIN_EXPECTED_DURATION}`)
      .max(MAX_EXPECTED_DURATION, `Maximum years is ${MAX_EXPECTED_DURATION}`),
  }),
});

export const ProjectSettingsContent = ({
  defaultProject,
}: {
  defaultProject: TProjectDTO;
}) => {
  console.log("Project settings content", defaultProject);
  const {
    handleProjectUpdate,
    isPending,
    isError,
    isSuccess,
    data: updatedProject,
  } = useProjectUpdateMutation(defaultProject._id);

  const project = updatedProject || defaultProject;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<ProjectFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: project.name,
      settings: {
        description: project.settings.description,
        baselineJobDuration: project.settings.baselineJobDuration,
        expectedRecentRelevantYears:
          project.settings.expectedRecentRelevantYears,
      },
    },
  });

  const onSubmit: SubmitHandler<ProjectFormValues> = (data) => {
    handleProjectUpdate(data);
  };

  useEffect(() => {
    // Reset form's dirty state after successful mutation
    // It will update the default form values to the latest saved state
    if (isSuccess && project) {
      reset({
        name: project.name,
        settings: {
          description: project.settings.description,
          baselineJobDuration: project.settings.baselineJobDuration,
          expectedRecentRelevantYears:
            project.settings.expectedRecentRelevantYears,
        },
      });
    }
  }, [isSuccess, project, reset]);

  return (
    <>
      <Snackbar type="danger" msg="Failed to update project." show={isError} />
      <Snackbar
        type="success"
        msg="Project details updated."
        show={isSuccess}
      />

      {/* Display form errors */}
      {Object.keys(errors).length > 0 && (
        <Alert color="danger" variant="soft" sx={{ mb: 2 }}>
          <Stack>
            <Regular>Please fix the following errors:</Regular>
            {errors.name && (
              <Small>• Project name: {errors.name.message}</Small>
            )}
            {errors.settings?.description && (
              <Small>
                • Description: {errors.settings.description.message}
              </Small>
            )}
            {errors.settings?.baselineJobDuration && (
              <Small>
                • Baseline job duration:{" "}
                {errors.settings.baselineJobDuration.message}
              </Small>
            )}
            {errors.settings?.expectedRecentRelevantYears && (
              <Small>
                • Expected recent relevant years:{" "}
                {errors.settings.expectedRecentRelevantYears.message}
              </Small>
            )}
          </Stack>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2} direction="row" flexWrap="wrap" pt={1}>
          <Stack flex={1} gap={2}>
            <BasicInfoSection control={control} />
            <DurationSettingsSection control={control} />
          </Stack>
          <Stack flex={1} gap={2} justifyContent="space-between">
            <SystemGeneratedSection project={project} />
            <FormActions
              isDirty={isDirty}
              reset={reset}
              isLoading={isPending}
              project={project}
            />
          </Stack>
        </Stack>
      </form>
    </>
  );
};

const BasicInfoSection = ({
  control,
}: {
  control: Control<ProjectFormValues>;
}) => {
  return (
    <Stack gap={2}>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => {
          return (
            <FormControl error={!!fieldState.error}>
              <FormLabel id="project-name-label" htmlFor={field.name} required>
                Project name
              </FormLabel>
              <Input {...field} id="project-name" error={!!fieldState.error} />
              {fieldState.error && (
                <FormHelperText>{fieldState.error.message}</FormHelperText>
              )}
            </FormControl>
          );
        }}
      />

      <Controller
        name="settings.description"
        control={control}
        render={({ field, fieldState }) => (
          <FormControl error={!!fieldState.error}>
            <FormLabel
              id="role-description-label"
              htmlFor={field.name}
              required
            >
              Description
            </FormLabel>
            <Textarea {...field} id="role-description" minRows={10} size="sm" />
            {fieldState.error && (
              <FormHelperText>{fieldState.error.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />
    </Stack>
  );
};

const DurationSettingsSection = ({
  control,
}: {
  control: Control<ProjectFormValues>;
}) => {
  return (
    <Stack gap={2}>
      <Card size="lg" variant="soft">
        <Controller
          name="settings.baselineJobDuration"
          control={control}
          render={({ field }) => (
            <>
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
                <Subtitle>{field.value} months</Subtitle>
              </Stack>
              <Slider
                {...field}
                id="baseline-job-duration"
                min={MIN_BASELINE_DURATION}
                max={MAX_BASELINE_DURATION}
                defaultValue={18}
                step={1}
                marks
                valueLabelDisplay="on"
                onChange={(_, value) => field.onChange(value)}
              />
            </>
          )}
        />
      </Card>
      <Card size="lg" variant="soft">
        <Controller
          name="settings.expectedRecentRelevantYears"
          control={control}
          render={({ field }) => (
            <>
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
                <Subtitle>{field.value} years</Subtitle>
              </Stack>
              <Slider
                {...field}
                id="expected-recent-relevant-years"
                min={MIN_EXPECTED_DURATION}
                max={MAX_EXPECTED_DURATION}
                defaultValue={3}
                step={1}
                marks
                valueLabelDisplay="on"
                onChange={(_, value) => field.onChange(value)}
              />
            </>
          )}
        />
      </Card>
    </Stack>
  );
};

const FormActions = ({
  isDirty,
  reset,
  isLoading,
  project,
}: {
  isDirty: boolean;
  reset: (values?: unknown) => void;
  isLoading: boolean;
  project: TProjectDTO;
}) => {
  const handleReset = () => {
    reset({
      name: project.name,
      settings: {
        description: project.settings.description,
        baselineJobDuration: project.settings.baselineJobDuration,
        expectedRecentRelevantYears:
          project.settings.expectedRecentRelevantYears,
      },
    });
  };

  return (
    <Stack direction="row" gap={2} justifyContent="end">
      <Button
        type="submit"
        color="primary"
        disabled={!isDirty || isLoading}
        loading={isLoading}
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
      <Button
        type="button"
        color="neutral"
        variant="outlined"
        onClick={handleReset}
        disabled={isLoading || !isDirty}
      >
        Reset
      </Button>
    </Stack>
  );
};

const SystemGeneratedSection = ({ project }: { project: TProjectDTO }) => {
  return (
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
          variant="soft"
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
  );
};
