import Stack from "@mui/joy/Stack";
import Chip from "@mui/joy/Chip";
import { SCOPE, SCOPE_NAMES, ScopeType } from "@kyd/common/api";
import { Regular, Small, Subtitle } from "@/components/typography.tsx";
import { TProjectDTO } from "@/api/query/types.ts";
import { Alert, Card, IconButton } from "@mui/joy";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningIcon from "@mui/icons-material/Warning";
import { Control, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCallback, useEffect } from "react";
import { useProjectUpdateMutation } from "@/api/query/useProjectUpdateMutation";
import { useExtractJobDataMutation } from "@/api/query/useExtractJobDataMutation";
import { Snackbar } from "@/components/Snackbar.tsx";

import { usePageContext } from "@/core/contexts/UsePageContext.tsx";
import { BasicInfoSection } from "./ProjectDetailsForm/BasicInfoSection.tsx";
import { DurationSettingsSection } from "./ProjectDetailsForm/DurationSettingsSection.tsx";
import {
  MAX_BASELINE_DURATION,
  MAX_EXPECTED_DURATION,
  MIN_BASELINE_DURATION,
  MIN_EXPECTED_DURATION,
} from "./ProjectDetailsForm/DurationSettingsSection.js";
import { ProjectFormValues } from "./ProjectDetailsForm/types.ts";

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
    techFocus: yup.array().of(yup.string().oneOf(SCOPE).defined()).default([]),
    technologies: yup
      .array()
      .of(
        yup.object({
          ref: yup.string().defined(),
          code: yup.string().defined(),
          name: yup.string().defined(),
        }),
      )
      .default([]),
  }),
});

export const ProjectSettingsContent = ({
  defaultProject,
}: {
  defaultProject: TProjectDTO;
}) => {
  const { updateHeaderState } = usePageContext();

  const {
    mutate: handleProjectUpdate,
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
    setValue,
    formState: { isDirty, errors, dirtyFields },
  } = useForm<ProjectFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: project.name,
      settings: {
        description: project.settings.description,
        baselineJobDuration: project.settings.baselineJobDuration,
        expectedRecentRelevantYears:
          project.settings.expectedRecentRelevantYears,
        techFocus: project.settings.techFocus,
        technologies: project.settings.technologies.map((tech) => ({
          name: tech.name,
          code: tech.code,
          ref: tech.ref,
        })),
      },
    },
  });

  const doSubmit = useCallback(
    handleSubmit((data: ProjectFormValues) =>
      handleProjectUpdate({
        projectId: defaultProject._id,
        projectData: data,
      }),
    ),
    [defaultProject._id, handleProjectUpdate, handleSubmit],
  );

  const doReset = useCallback(
    () =>
      reset({
        name: project.name,
        settings: {
          description: project.settings.description,
          baselineJobDuration: project.settings.baselineJobDuration,
          expectedRecentRelevantYears:
            project.settings.expectedRecentRelevantYears,
          techFocus: project.settings.techFocus,
          technologies: project.settings.technologies,
        },
      }),
    [project, reset],
  );

  useEffect(() => {
    updateHeaderState({
      isLoading: isPending,
      disabled: isPending || !isDirty,
      reset: doReset,
      submit: doSubmit,
    });
  }, [doReset, doSubmit, isDirty, isPending, updateHeaderState]);

  useEffect(() => {
    // Reset form's dirty state after successful mutation
    // It will update the default form values to the latest saved state
    if (isSuccess && project) {
      doReset();
    }
  }, [doReset, isSuccess, project, reset]);

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
            {errors.name && <Small>●Job title: {errors.name.message}</Small>}
            {errors.settings?.description && (
              <Small>●Description: {errors.settings.description.message}</Small>
            )}
            {errors.settings?.baselineJobDuration && (
              <Small>
                ●Baseline job duration:{" "}
                {errors.settings.baselineJobDuration.message}
              </Small>
            )}
            {errors.settings?.expectedRecentRelevantYears && (
              <Small>
                ●Expected recent relevant years:{" "}
                {errors.settings.expectedRecentRelevantYears.message}
              </Small>
            )}
            {errors.settings?.techFocus && (
              <Small>
                ●Technical Focus: {errors.settings.techFocus.message}
              </Small>
            )}
            {errors.settings?.technologies && (
              <Small>
                ●Technologies: {errors.settings.technologies.message}
              </Small>
            )}
          </Stack>
        </Alert>
      )}

      <form>
        <Stack gap={2} direction="row" flexWrap="wrap" pt={1}>
          <Stack flex={1} gap={2}>
            <BasicInfoSection control={control} />
          </Stack>
          <Stack flex={1} gap={2}>
            <SystemGeneratedSection
              project={project}
              isDescriptionDirty={!!dirtyFields.settings?.description}
              control={control}
              setTechFocus={(value) => setValue("settings.techFocus", value)}
              setTechnologies={(value) =>
                setValue("settings.technologies", value)
              }
            />
            <DurationSettingsSection control={control} />
          </Stack>
        </Stack>
      </form>
    </>
  );
};

const SystemGeneratedSection = ({
  project,
  isDescriptionDirty,
  control,
  setTechFocus,
  setTechnologies,
}: {
  project: TProjectDTO;
  isDescriptionDirty: boolean;
  control: Control<ProjectFormValues>;
  setTechFocus: (value: ScopeType[]) => void;
  setTechnologies: (
    value: ProjectFormValues["settings"]["technologies"],
  ) => void;
}) => {
  console.log({ project });
  const {
    mutate: extractJobData,
    isPending,
    isError,
    isSuccess,
    data: extractedData,
  } = useExtractJobDataMutation();

  // Watch the form values
  const formValues = useWatch({ control });

  useEffect(() => {
    if (extractedData) {
      setTechnologies(extractedData.technologies);
      setTechFocus(extractedData.techFocus);
    }
  }, [extractedData, setTechFocus, setTechnologies]);
  const name = formValues.name?.trim();
  const description = formValues.settings?.description?.trim();

  const handleRegenerate = () => {
    if (!name || !description) {
      return;
    }

    extractJobData({
      title: name,
      description: description,
      projectId: project._id,
    });
  };

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
        {isDescriptionDirty && (
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
        )}
        {isSuccess && (
          <Snackbar
            type="success"
            show={isSuccess}
            msg="Settings successfully re-generated."
          />
        )}
        {isError && (
          <Snackbar
            type="danger"
            show={isError}
            msg="Failed to re-generate settings. Please try again later."
          />
        )}
        <Stack direction="row" alignItems="center">
          <IconButton
            size="md"
            color="success"
            variant="plain"
            onClick={handleRegenerate}
            loading={isPending}
            disabled={!name || !description}
          >
            <Stack
              direction="row"
              gap={1}
              alignItems="center"
              flexWrap="nowrap"
            >
              <RefreshIcon />
              <Subtitle color="success">Re-generate settings</Subtitle>
            </Stack>
          </IconButton>
        </Stack>
      </Stack>
      <Small>Technical Focus</Small>
      <Stack direction="row" gap={1} flexWrap="wrap">
        {formValues.settings?.techFocus?.map((tech) => (
          <Chip key={tech} variant="soft" color="primary" size="md">
            {SCOPE_NAMES[tech]}
          </Chip>
        )) || <Regular>No technologies specified.</Regular>}
      </Stack>

      <Small>Technologies</Small>
      <Stack direction="row" gap={1} flexWrap="wrap">
        {formValues.settings?.technologies?.map((tech) => (
          <Chip key={tech.code} variant="soft" color="primary" size="md">
            {tech.name}
          </Chip>
        )) || <Regular>No technologies specified.</Regular>}
      </Stack>
    </Card>
  );
};
