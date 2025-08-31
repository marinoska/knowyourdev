import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useForm,
  Control,
  UseFormStateReturn,
  useWatch,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TProjectDTO } from "@/api/query/types.ts";
import { useProjectUpdateMutation } from "@/api/query/useProjectUpdateMutation.ts";
import { usePageContext } from "@/core/contexts/UsePageContext.tsx";
import { ProjectFormValues } from "./ProjectDetailsPage/ProjectDetailsForm/types.ts";
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
    lastSyncedDescription: yup.string().default(""),
    isDescriptionOutOfSync: yup.boolean().default(false),
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

export type ProjectSettingsContextType = {
  project: TProjectDTO;
  control: Control<ProjectFormValues>;
  formState: UseFormStateReturn<ProjectFormValues>;
  setTechFocus: (value: ScopeType[]) => void;
  setTechnologies: (
    value: { ref: string; code: string; name: string }[],
  ) => void;
  markDescriptionSynced: (value: string) => void;
  isRegenerating: boolean;
  setRegenerating: (value: boolean) => void;
  isError: boolean;
  isSuccess: boolean;
};

export const ProjectSettingsFormContext = createContext<
  ProjectSettingsContextType | undefined
>(undefined);

export const ProjectSettingsFormProvider = ({
  defaultProject,
  children,
}: {
  defaultProject: TProjectDTO;
  children: ReactNode;
}) => {
  const { updateHeaderState } = usePageContext();
  const [isRegenerating, setRegenerating] = useState(false);

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
          lastSyncedDescription: project.settings.description,
          isDescriptionOutOfSync: false,
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
          lastSyncedDescription: project.settings.description,
          isDescriptionOutOfSync: false,
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

  const isDescriptionOutOfSync = useWatch({
    control,
    name: "settings.isDescriptionOutOfSync",
  });

  useEffect(() => {
    updateHeaderState({
      isLoading: isPending,
      disabled:
        isPending ||
        isRegenerating ||
        !!isDescriptionOutOfSync ||
        !formState.isDirty,
      reset: doReset,
      submit: doSubmit,
    });
  }, [
    doReset,
    doSubmit,
    formState.isDirty,
    isPending,
    isRegenerating,
    isDescriptionOutOfSync,
    updateHeaderState,
  ]);

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

  const markDescriptionSynced = useCallback(
    (value: string) => {
      setValue("settings.lastSyncedDescription", value, {
        shouldDirty: false,
      });
      setValue("settings.isDescriptionOutOfSync", false, {
        shouldDirty: false,
      });
    },
    [setValue],
  );

  const currentDescription = useWatch({
    control,
    name: "settings.description",
  });
  const lastSynced = useWatch({
    control,
    name: "settings.lastSyncedDescription",
  });
  useEffect(() => {
    const a = (currentDescription || "").trim();
    const b = (lastSynced || "").trim();
    const changed = a !== b;
    setValue("settings.isDescriptionOutOfSync", changed, {
      shouldDirty: false,
    });
  }, [currentDescription, lastSynced, setValue]);

  const contextValue = useMemo<ProjectSettingsContextType>(
    () => ({
      project,
      control,
      formState,
      setTechFocus,
      setTechnologies,
      markDescriptionSynced,
      isRegenerating,
      setRegenerating,
      isError,
      isSuccess,
    }),
    [
      project,
      control,
      formState,
      isError,
      isSuccess,
      setTechFocus,
      setTechnologies,
      markDescriptionSynced,
      isRegenerating,
      setRegenerating,
    ],
  );

  return (
    <ProjectSettingsFormContext.Provider value={contextValue}>
      {children}
    </ProjectSettingsFormContext.Provider>
  );
};
