import Stack from "@mui/joy/Stack";
import {
  SCOPE,
  ScopeType,
  MAX_BASELINE_DURATION,
  MAX_EXPECTED_DURATION,
  MIN_BASELINE_DURATION,
  MIN_EXPECTED_DURATION,
} from "@kyd/common/api";
import { Regular, Small } from "@/components/typography.tsx";
import { TProjectDTO } from "@/api/query/types.ts";
import { Alert } from "@mui/joy";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useCallback, useEffect } from "react";
import { useProjectUpdateMutation } from "@/api/query/useProjectUpdateMutation";
import { Snackbar } from "@/components/Snackbar.tsx";
import { usePageContext } from "@/core/contexts/UsePageContext.tsx";
import { BasicInfoSection } from "./ProjectDetailsForm/BasicInfoSection.tsx";
import { DurationSettingsSection } from "./ProjectDetailsForm/DurationSettingsSection.tsx";
import { ProjectFormValues } from "./ProjectDetailsForm/types.ts";
import { SystemGeneratedSection } from "@/pages/Projects/ProjectDetailsPage/ProjectDetailsForm/SystemGeneratedSection.tsx";

const validationSchema = yup.object({
  name: yup.string().required("Project name is required"),
  settings: yup.object({
    description: yup.string().required("Description is required"),
    baselineJobDuration: yup
      .number()
      .required("Expected Tenure at a job is required")
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

export const ProjectSettingsTab = ({
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
        projectData: {
          name: dirtyFields.name ? data.name : undefined,
          settings: {
            description: dirtyFields.settings?.description
              ? data.settings.description
              : undefined,
            baselineJobDuration: dirtyFields.settings?.baselineJobDuration
              ? data.settings.baselineJobDuration
              : undefined,
            expectedRecentRelevantYears: dirtyFields.settings
              ?.expectedRecentRelevantYears
              ? data.settings.expectedRecentRelevantYears
              : undefined,
            techFocus: dirtyFields.settings?.techFocus
              ? data.settings.techFocus
              : undefined,
            technologies: dirtyFields.settings?.technologies
              ? data.settings.technologies
              : undefined,
          },
        },
      }),
    ),
    [defaultProject._id, handleProjectUpdate, handleSubmit, dirtyFields],
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
          techFocus: [...project.settings.techFocus], // Create a new array to ensure proper reset
          technologies: project.settings.technologies.map((tech) => ({
            name: tech.name,
            code: tech.code,
            ref: tech.ref,
          })),
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

  const setTechFocus = useCallback(
    (value: ScopeType[]) =>
      setValue("settings.techFocus", value, { shouldDirty: true }),
    [setValue],
  );
  const setTechnologies = useCallback(
    (value: { ref: string; code: string; name: string }[]) =>
      setValue("settings.technologies", value, { shouldDirty: true }),
    [setValue],
  );

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
                ●Expected Tenure: {errors.settings.baselineJobDuration.message}
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
              setTechFocus={setTechFocus}
              setTechnologies={setTechnologies}
            />
            <DurationSettingsSection control={control} />
          </Stack>
        </Stack>
      </form>
    </>
  );
};
