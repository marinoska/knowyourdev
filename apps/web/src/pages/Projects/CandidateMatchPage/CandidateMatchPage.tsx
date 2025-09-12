import { Snackbar } from "@/components/Snackbar.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { BasePage } from "@/components/BasePage.tsx";
import { monthsToYearsAndMonths } from "@/utils/dates.ts";
import { Small, Subtitle, Title } from "@/components/typography.tsx";
import Stack from "@mui/joy/Stack";
import { OverallMatch } from "@/pages/Projects/CandidateMatchPage/OverallMatch.tsx";
import { Alert, Button } from "@mui/joy";
import Box from "@mui/joy/Box";
import { ColorPaletteProp } from "@mui/joy/styles";
import type { TProjectDTO, TResumeProfileDTO } from "@/api/query/types.ts";
import type { WithCandidateMatch } from "@kyd/common/api";
import { JobStability } from "@/pages/Projects/CandidateMatchPage/JobStability.tsx";
import { useResumeProfileQuery } from "@/api/query/useResumeProfileQuery.ts";
import { TechMatch } from "@/pages/Projects/CandidateMatchPage/TechMatch.tsx";
import { TechFocusMatch } from "@/pages/Projects/CandidateMatchPage/TechFocusMatch.tsx";
import { useProjectSettingsFormContext } from "../ProjectSettingsFormContext.tsx";
import { computeCandidateMatch } from "./computeMatch.ts";
import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import CenteredLoader from "@/components/Loader.tsx";

type CandidateDetailsParams = {
  id: string;
  candidateId: string;
};

export const CandidateMatchPage = () => {
  const { id: projectId, candidateId } = useParams<CandidateDetailsParams>();
  const navigate = useNavigate();
  if (!candidateId || !projectId) {
    throw new Error(
      "Missing required parameters. Please ensure you have a valid project and candidate ID.",
    );
  }

  const candidateQuery = useResumeProfileQuery({
    uploadId: candidateId,
  });

  const { project, control } = useProjectSettingsFormContext();
  const watchedSettings = useWatch({ control, name: "settings" });
  const effectiveProject = useMemo<TProjectDTO | null>(() => {
    return {
      ...project,
      settings: {
        ...project.settings,
        ...watchedSettings,
      },
    } as TProjectDTO;
  }, [project, watchedSettings]);

  const isError = candidateQuery.isError;

  if (candidateQuery.isLoading) {
    return <CenteredLoader />;
  }

  const { years, months } = monthsToYearsAndMonths(
    (candidateQuery.profile?.monthsActiveInSE as number) || 0,
  );

  return (
    <>
      <Snackbar
        type="danger"
        msg="Failed to load candidate details."
        show={isError}
      />
      <BasePage.Header
        showBackButton
        caption={`Project: ${effectiveProject?.name ?? ""}`}
        subtitle={`${candidateQuery.profile?.position} •${years} years ${months} month net active time`}
        title={candidateQuery.profile?.fullName}
      >
        <Button
          onClick={() => navigate(`/uploads/${candidateId}`)}
          variant="solid"
        >
          View Profile
        </Button>
      </BasePage.Header>
      <BasePage.Content>
        {effectiveProject && candidateQuery.profile
          ? (() => {
              const candidateWithMatch = {
                ...(candidateQuery.profile as TResumeProfileDTO),
                match: computeCandidateMatch(
                  effectiveProject,
                  candidateQuery.profile as TResumeProfileDTO,
                ),
              } as TResumeProfileDTO<WithCandidateMatch>;
              return (
                <CandidateDetails
                  candidate={candidateWithMatch}
                  project={effectiveProject}
                />
              );
            })()
          : null}
      </BasePage.Content>
    </>
  );
};

const CareerDetailsAlert = ({
  color,
  text,
  title,
}: {
  color: ColorPaletteProp;
  title: string;
  text: string;
}) => {
  return (
    <Alert
      variant="soft"
      color={color}
      startDecorator={
        <Box
          width={12}
          height={12}
          borderRadius="50%"
          bgcolor={`${color}.500`}
          mr={1}
        />
      }
    >
      <Stack>
        <Subtitle>{title}</Subtitle>
        <Small>(hardcoded, not implemented) {text}</Small>
      </Stack>
    </Alert>
  );
};

const RedFlags = () => {
  return (
    <BasePage.Sheet>
      <Stack gap={2}>
        <Title text="Risk assessment" />
        <CareerDetailsAlert
          color="warning"
          title="Career Gap Detected"
          text="6 months gap in 2022"
        />
        <CareerDetailsAlert
          color="warning"
          title="Limited backend experience"
          text="No experience with backend technologies since 2018"
        />
        <CareerDetailsAlert
          color="warning"
          title="Tech stack inconsistency"
          text="Node.js, PHP, no backend framework mentioned"
        />
      </Stack>
    </BasePage.Sheet>
  );
};

const Actions = () => {
  return (
    <BasePage.Sheet>
      <Stack gap={2}>
        <Title text="Actions" />
      </Stack>
    </BasePage.Sheet>
  );
};

const RoleSuitability = () => {
  return (
    <BasePage.Sheet>
      <Title text="Role suitability" />
    </BasePage.Sheet>
  );
};

const KeyStrengths = () => {
  return (
    <BasePage.Sheet>
      <Stack gap={2}>
        <Title text="Key Strengths" />
        <CareerDetailsAlert
          color="success"
          title="Progressive career growth"
          text="100% growth"
        />
      </Stack>
    </BasePage.Sheet>
  );
};

const CandidateDetails = ({
  candidate,
  project,
}: {
  candidate: TResumeProfileDTO<WithCandidateMatch>;
  project: TProjectDTO;
}) => {
  return (
    <Stack direction="row" spacing={2}>
      <Stack direction="column" flex={2}>
        <TechFocusMatch
          project={project}
          techFocusMatch={candidate.match.techFocusMatch}
        />
        <TechMatch project={project} techMatch={candidate.match.techMatch} />
      </Stack>
      <Stack flex={1} direction="column" gap={2}>
        <OverallMatch match={candidate.match!} />
        <JobStability match={candidate.match!} />
        <RedFlags />
        <KeyStrengths />
        <RoleSuitability />
        <Actions />
      </Stack>
    </Stack>
  );
};
