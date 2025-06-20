import { Snackbar } from "@/components/Snackbar.tsx";
import { useUploadProfileQuery } from "@/api/query/useUploadsQuery.ts";
import { useProjectProfileQuery } from "@/api/query/useProjectsQuery.ts";
import { useParams } from "react-router-dom";
import { BasePage } from "@/components/BasePage.tsx";
import { ResumeProfileProvider } from "@/pages/Core/ResumeProfileProvider.tsx";
import { monthsToYearsAndMonths } from "@/utils/dates.ts";
import { useResumeProfileContext } from "@/pages/Core/ResumeProfileContext.ts";

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
      </BasePage>
    </>
  );
};

export default CandidateDetailsPage;
