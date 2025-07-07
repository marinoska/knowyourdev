import { Snackbar } from "@/components/Snackbar.tsx";
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
import { TechMatch } from "@/pages/Projects/Details/CandidatesDetailsPage/TechMatch.tsx";
import { useCandidateMatch } from "@/pages/Core/useCandidateMatch.ts";
import { Alert } from "@mui/joy";
import Box from "@mui/joy/Box";
import { ColorPaletteProp } from "@mui/joy/styles";
import { TProject } from "@/api/query/types.ts";
import { JobStability } from "@/pages/Projects/Details/CandidatesDetailsPage/JobStability.tsx";
import { useResumeProfileQuery } from "@/api/query/useResumeProfileQuery.ts";

type CandidateDetailsParams = {
  id: string;
  candidateId: string;
};

export const CandidateMatchPage = () => {
  const { id, candidateId } = useParams<CandidateDetailsParams>();

  const candidateQuery = useResumeProfileQuery({ uploadId: candidateId });
  const projectQuery = useProjectProfileQuery({ projectId: id });

  const isLoading = candidateQuery.isLoading || projectQuery.isLoading;
  const isError = candidateQuery.isError || projectQuery.isError;

  return (
    <ResumeProfileProvider profile={candidateQuery.profile}>
      <CandidateDetails
        project={projectQuery.data}
        isLoading={isLoading}
        isError={isError}
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

const KeyStrengths = () => {
  // TODO implement
  return null;

  // return (
  //   <BasePage.Sheet>
  //     {/*<Title text="Key Strengths" />*/}
  //   </BasePage.Sheet>
  // );
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
  project,
  isLoading,
  isError,
}: {
  project?: TProject;
  isLoading: boolean;
  isError: boolean;
}) => {
  const { monthsActive, profile } = useResumeProfileContext();
  const { years, months } = monthsToYearsAndMonths(monthsActive);

  const candidateMatch = useCandidateMatch({
    project,
    candidate: profile,
  });

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
                techFocusMatch={candidateMatch.techFocusMatch}
              />
              <TechMatch
                project={project}
                techMatch={candidateMatch.techMatch}
              />
              <RiskAssessment />
            </Stack>
            <Stack flex={1} direction="column" gap={2}>
              <OverallMatch match={candidateMatch} />
              <RoleSuitability />
              <JobStability match={candidateMatch} />
              <Actions />
            </Stack>
          </Stack>
        </BasePage.Content>
      </BasePage>
    </>
  );
};
