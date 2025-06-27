import { Snackbar } from "@/components/Snackbar.tsx";
import { useUploadProfileQuery } from "@/api/query/useUploadsQuery.ts";
import { useProjectProfileQuery } from "@/api/query/useProjectsQuery.ts";
import { useParams } from "react-router-dom";
import { BasePage } from "@/components/BasePage.tsx";
import { ResumeProfileProvider } from "@/pages/Core/ResumeProfileProvider.tsx";
import { monthsToYearsAndMonths } from "@/utils/dates.ts";
import { useResumeProfileContext } from "@/pages/Core/ResumeProfileContext.ts";
import { Small, Subtitle, Title } from "@/components/typography.tsx";
import Stack from "@mui/joy/Stack";
import { OverallMatch } from "@/pages/Projects/Details/CandidatesDetailsPage/OverallMatch.tsx";
import { TechFocusMatch } from "@/pages/Projects/Details/CandidatesDetailsPage/TechFocusMatch.tsx";
import { useCandidateMatch } from "@/pages/Projects/Details/CandidatesDetailsPage/useCandidateMatch.ts";
import { MatchDetailsRow } from "@/pages/Projects/Details/CandidatesDetailsPage/MatchDetailsRow.tsx";
import { Alert } from "@mui/joy";
import Box from "@mui/joy/Box";
import { ColorPaletteProp } from "@mui/joy/styles";

type CandidateDetailsParams = {
  id: string;
  candidateId: string;
};

export const CandidateDetailsPage = () => {
  const { id, candidateId } = useParams<CandidateDetailsParams>();

  const candidateQuery = useUploadProfileQuery({ uploadId: candidateId });
  const projectQuery = useProjectProfileQuery({ projectId: id });

  return (
    <ResumeProfileProvider profile={candidateQuery.profile}>
      <CandidateDetails
        candidateQuery={candidateQuery}
        projectQuery={projectQuery}
      />
    </ResumeProfileProvider>
  );
};

const CareerDetailsAlert = ({ color }: { color: ColorPaletteProp }) => {
  return (
    <Alert
      variant="soft"
      color={color}
      startDecorator={
        <Box
          width={16}
          height={16}
          borderRadius="50%"
          bgcolor={`${color}.500`}
          mr={1}
        />
      }
    >
      <Stack>
        <Subtitle>Career Gap Detected</Subtitle>
        <Small>6 months gap in 2022</Small>
      </Stack>
    </Alert>
  );
};

const JobStability = () => {
  return (
    <BasePage.Sheet>
      <Stack direction="column" gap={0.5}>
        <Title text="Job stability" />
        <MatchDetailsRow
          value="18 months"
          color="neutral"
          text="Baseline Job Duration"
        />
        <MatchDetailsRow
          value="24 months"
          color="success"
          text="Average Job Duration"
        />
      </Stack>
    </BasePage.Sheet>
  );
};

const KeyStrengths = () => {
  return (
    <BasePage.Sheet>
      <Title text="Key Strengths" />
    </BasePage.Sheet>
  );
};

const RiskAssessment = () => {
  return (
    <BasePage.Sheet>
      <Stack gap={2}>
        <Title text="Risk Assessment" />
        <CareerDetailsAlert color="danger" />
        <CareerDetailsAlert color="warning" />
        <CareerDetailsAlert color="success" />
      </Stack>
    </BasePage.Sheet>
  );
};

const Actions = () => {
  return (
    <BasePage.Sheet>
      <Title text="Actions" />
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

const CandidateDetails = ({
  candidateQuery: {
    profile,
    isError: isCandidateError,
    isLoading: isCandidateLoading,
  },
  projectQuery: {
    data: project,
    isError: isProjectError,
    isLoading: isProjectLoading,
  },
}: {
  candidateQuery: ReturnType<typeof useUploadProfileQuery>;
  projectQuery: ReturnType<typeof useProjectProfileQuery>;
}) => {
  const { monthsActive, scopes: candidateScopes } = useResumeProfileContext();
  const { years, months } = monthsToYearsAndMonths(monthsActive);

  const candidateMatch = useCandidateMatch({
    candidateScopes,
    scopeCodes: project?.settings.techFocus || [],
    expectedRecentRelevantYears:
      project?.settings.expectedRecentRelevantYears || 0,
  });

  const isLoading = isCandidateLoading || isProjectLoading;
  const isError = isCandidateError || isProjectError;

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
        showEmpty={!profile || !project}
      >
        <BasePage.Header
          showBackButton
          caption={`Project: ${project?.name}`}
          subtitle={`${profile?.position} • ${years} years ${months} month net active time`}
          title={profile?.fullName}
        />
        <BasePage.Content>
          <Stack direction="row" spacing={2}>
            <Stack direction="column" flex={2}>
              <KeyStrengths />
              <TechFocusMatch
                project={project}
                techFocusActivities={candidateMatch}
              />
              <RiskAssessment />
            </Stack>
            <Stack flex={1} direction="column" gap={2}>
              <OverallMatch />
              <RoleSuitability />
              <JobStability />
              <Actions />
            </Stack>
          </Stack>
        </BasePage.Content>
      </BasePage>
    </>
  );
};
