import Stack from "@mui/joy/Stack";
import { Regular, Small } from "@/components/typography.tsx";
import { Alert } from "@mui/joy";
import { Snackbar } from "@/components/Snackbar.tsx";
import { BasicInfoSection } from "./ProjectDetailsForm/BasicInfoSection.tsx";
import { DurationSettingsSection } from "./ProjectDetailsForm/DurationSettingsSection.tsx";
import { SystemGeneratedSection } from "@/pages/Projects/ProjectDetailsPage/ProjectDetailsForm/SystemGeneratedSection.tsx";
import { useProjectSettingsFormContext } from "../ProjectSettingsFormContext.tsx";

export const ProjectSettingsTab = () => {
  const {
    project,
    control,
    formState,
    setTechFocus,
    setTechnologies,
    isError,
    isSuccess,
  } = useProjectSettingsFormContext();
  return (
    <>
      <Snackbar type="danger" msg="Failed to update project." show={isError} />
      <Snackbar
        type="success"
        msg="Project details updated."
        show={isSuccess}
      />

      {Object.keys(formState.errors).length > 0 && (
        <Alert color="danger" variant="soft" sx={{ mb: 2 }}>
          <Stack>
            <Regular>Please fix the following errors:</Regular>
            {formState.errors.name && (
              <Small>●Job title: {formState.errors.name.message}</Small>
            )}
            {formState.errors.settings?.description && (
              <Small>
                ●Description: {formState.errors.settings.description.message}
              </Small>
            )}
            {formState.errors.settings?.baselineJobDuration && (
              <Small>
                ●Expected Tenure:{" "}
                {formState.errors.settings.baselineJobDuration.message}
              </Small>
            )}
            {formState.errors.settings?.expectedRecentRelevantYears && (
              <Small>
                ●Expected recent relevant years:{" "}
                {formState.errors.settings.expectedRecentRelevantYears.message}
              </Small>
            )}
            {formState.errors.settings?.techFocus && (
              <Small>
                ●Technical Focus: {formState.errors.settings.techFocus.message}
              </Small>
            )}
            {formState.errors.settings?.technologies && (
              <Small>
                ●Technologies: {formState.errors.settings.technologies.message}
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
              isDescriptionDirty={!!formState.dirtyFields.settings?.description}
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
