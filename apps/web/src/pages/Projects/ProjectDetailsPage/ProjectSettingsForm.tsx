import { useCallback, useEffect, ReactNode } from "react";
import { useForm, Control, UseFormStateReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TProjectDTO } from "@/api/query/types.ts";
import { useProjectUpdateMutation } from "@/api/query/useProjectUpdateMutation";
import { usePageContext } from "@/core/contexts/UsePageContext.tsx";
import { ProjectFormValues } from "./ProjectDetailsForm/types.ts";
import {
  SCOPE,
  ScopeType,
  MAX_BASELINE_DURATION,
  MAX_EXPECTED_DURATION,
  MIN_BASELINE_DURATION,
  MIN_EXPECTED_DURATION,
} from "@kyd/common/api";

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

export type ProjectSettingsChildrenProps = {
  project: TProjectDTO;
  control: Control<ProjectFormValues>;
  formState: UseFormStateReturn<ProjectFormValues>;
  setTechFocus: (value: ScopeType[]) => void;
  setTechnologies: (
    value: { ref: string; code: string; name: string }[],
  ) => void;
  isError: boolean;
  isSuccess: boolean;
};

export const ProjectSettingsForm = ({
  defaultProject,
  children,
}: {
  defaultProject: TProjectDTO;
  children: (props: ProjectSettingsChildrenProps) => ReactNode;
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

  const { control, handleSubmit, reset, setValue, formState } =
    useForm<ProjectFormValues>({
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
          name: formState.dirtyFields.name ? data.name : undefined,
          settings: {
            description: formState.dirtyFields.settings?.description
              ? data.settings.description
              : undefined,
            baselineJobDuration: formState.dirtyFields.settings
              ?.baselineJobDuration
              ? data.settings.baselineJobDuration
              : undefined,
            expectedRecentRelevantYears: formState.dirtyFields.settings
              ?.expectedRecentRelevantYears
              ? data.settings.expectedRecentRelevantYears
              : undefined,
            techFocus: formState.dirtyFields.settings?.techFocus
              ? data.settings.techFocus
              : undefined,
            technologies: formState.dirtyFields.settings?.technologies
              ? data.settings.technologies
              : undefined,
          },
        },
      }),
    ),
    [
      defaultProject._id,
      handleProjectUpdate,
      handleSubmit,
      formState.dirtyFields,
    ],
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
          techFocus: [...project.settings.techFocus],
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
      disabled: isPending || !formState.isDirty,
      reset: doReset,
      submit: doSubmit,
    });
  }, [doReset, doSubmit, formState.isDirty, isPending, updateHeaderState]);

  useEffect(() => {
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

  return children({
    control,
    project,
    formState,
    setTechFocus,
    setTechnologies,
    isError,
    isSuccess,
  });
};

export default ProjectSettingsForm;
