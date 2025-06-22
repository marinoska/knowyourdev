import { ScopeType, SCOPE_NAMES } from "@kyd/common/api";
import { Snackbar } from "@/components/Snackbar.tsx";
import { useUploadProfileQuery } from "@/api/query/useUploadsQuery.ts";
import { useProjectProfileQuery } from "@/api/query/useProjectsQuery.ts";
import { useParams } from "react-router-dom";
import { BasePage } from "@/components/BasePage.tsx";
import { ResumeProfileProvider } from "@/pages/Core/ResumeProfileProvider.tsx";
import { monthsToYearsAndMonths } from "@/utils/dates.ts";
import { useResumeProfileContext } from "@/pages/Core/ResumeProfileContext.ts";
import { Subtitle } from "@/components/typography.tsx";
import Stack from "@mui/joy/Stack";
import { ActivityCard } from "@/pages/Projects/Details/components/TechFocusMatchBar.tsx";
import Typography from "@mui/joy/Typography";
import { Box } from "@mui/joy";

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
  const { monthsActive } = useResumeProfileContext();
  const { years, months } = monthsToYearsAndMonths(monthsActive);

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
          <TechFocusMatch techFocusList={project?.settings.techFocus} />
        </BasePage.Content>
      </BasePage>
    </>
  );
};

type TechFocusMatchProps = {
  techFocusList?: ScopeType[];
};

const TechFocusMatch = ({ techFocusList = [] }: TechFocusMatchProps) => {
  return (
    <Stack gap={2}>
      <Box>
        <Subtitle text={"Tech Focus Match"} />
        <Typography color="neutral" level="body-sm">
          Based on recent experience (last 5 years)
        </Typography>
      </Box>
      {techFocusList.map((scope) => (
        <ActivityCard scope={SCOPE_NAMES[scope]} color="success" />
      ))}
    </Stack>
  );
};
