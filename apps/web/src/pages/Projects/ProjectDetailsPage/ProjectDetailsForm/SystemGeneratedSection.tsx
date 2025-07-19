import { TProjectDTO } from "@/api/query/types.ts";
import { Control, useWatch } from "react-hook-form";
import { ProjectFormValues } from "@/pages/Projects/ProjectDetailsPage/ProjectDetailsForm/types.ts";
import { useExtractJobDataMutation } from "@/api/query/useExtractJobDataMutation.ts";
import { useEffect, useState } from "react";
import { Alert, Card, IconButton } from "@mui/joy";
import Stack from "@mui/joy/Stack";
import { Regular, Small, Subtitle } from "@/components/typography.tsx";
import WarningIcon from "@mui/icons-material/Warning";
import { Snackbar } from "@/components/Snackbar.tsx";
import RefreshIcon from "@mui/icons-material/Refresh";
import Chip from "@mui/joy/Chip";
import { SCOPE_NAMES, ScopeType } from "@kyd/common/api";

export const SystemGeneratedSection = ({
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
  const {
    mutate: extractJobData,
    isPending,
    isError,
    isSuccess,
    data: extractedData,
  } = useExtractJobDataMutation();

  const formValues = useWatch({ control });

  useEffect(() => {
    if (extractedData) {
      setTechnologies([...extractedData.technologies]);
      setTechFocus([...extractedData.techFocus]);
    }
  }, [extractedData, setTechFocus, setTechnologies]);

  const name = formValues.name?.trim();
  const description = formValues.settings?.description?.trim();
  const [lastGeneratedDescription, setLastGeneratedDescription] =
    useState(description);

  const handleRegenerate = () => {
    if (!name || !description) {
      return;
    }
    setLastGeneratedDescription(description);
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
        {isDescriptionDirty && lastGeneratedDescription !== description && (
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
