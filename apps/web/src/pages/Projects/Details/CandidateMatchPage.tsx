import { Snackbar } from "@/components/Snackbar.tsx";
import { useProjectProfileQuery } from "@/api/query/useProjectsQuery.ts";
import { useParams } from "react-router-dom";
import { BasePage } from "@/components/BasePage.tsx";
import { monthsToYearsAndMonths } from "@/utils/dates.ts";
import { Small, Subtitle, Title } from "@/components/typography.tsx";
import Stack from "@mui/joy/Stack";
import { OverallMatch } from "@/pages/Projects/Details/CandidatesDetailsPage/OverallMatch.tsx";
import { Alert } from "@mui/joy";
import Box from "@mui/joy/Box";
import { ColorPaletteProp } from "@mui/joy/styles";
import { TProjectDTO, TResumeProfileDTO } from "@/api/query/types.ts";
import { WithCandidateMatch } from "@kyd/common/api";
import { JobStability } from "@/pages/Projects/Details/CandidatesDetailsPage/JobStability.tsx";
import { useResumeProfileQuery } from "@/api/query/useResumeProfileQuery.ts";
import { TechMatch } from "@/pages/Projects/Details/CandidatesDetailsPage/TechMatch.tsx";
import { TechFocusMatch } from "@/pages/Projects/Details/CandidatesDetailsPage/TechFocusMatch.tsx";

type CandidateDetailsParams = {
  id: string;
  candidateId: string;
};

export const CandidateMatchPage = () => {
  const { id: projectId, candidateId } = useParams<CandidateDetailsParams>();

  if (!candidateId || !projectId) {
    throw new Error(
      "Missing required parameters. Please ensure you have a valid project and candidate ID.",
    );
  }

  const candidateQuery = useResumeProfileQuery({
    uploadId: candidateId,
    projectId,
  });
  const projectQuery = useProjectProfileQuery({ projectId });

  const isLoading = candidateQuery.isLoading || projectQuery.isLoading;
  const isError = candidateQuery.isError || projectQuery.isError;
  const { years, months } = monthsToYearsAndMonths(
    candidateQuery.profile?.monthsActiveInSE || 0,
  );

  return (
    <>
      <Snackbar
        type="danger"
        msg="Failed to load candidate details."
        show={isError}
      />
      <BasePage
        isLoading={isLoading}
        isError={isError}
        showEmpty={!candidateQuery.profile || !projectQuery.data}
      >
        <BasePage.Header
          showBackButton
          caption={`Project: ${projectQuery.data?.name}`}
          subtitle={`${candidateQuery.profile?.position} • ${years} years ${months} month net active time`}
          title={candidateQuery.profile?.fullName}
        />
        <BasePage.Content>
          {projectQuery.data && candidateQuery.profile ? (
            <CandidateDetails
              candidate={
                candidateQuery.profile as TResumeProfileDTO<WithCandidateMatch>
              }
              project={projectQuery.data}
            />
          ) : null}
        </BasePage.Content>
      </BasePage>
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
        <Small>{text}</Small>
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
          color="danger"
          title="Legacy technologies"
          text="jQuery, Backbone, AngularJS"
        />
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
        />{" "}
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
