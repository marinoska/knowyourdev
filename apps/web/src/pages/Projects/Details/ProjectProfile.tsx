import { Snackbar } from "@/components/Snackbar.tsx";
import { useProjectProfileQuery } from "@/api/query/useProjectsQuery.ts";
import { useParams } from "react-router-dom";
import { BasePage } from "@/components/BasePage.tsx";
import Tabs, { TabItem } from "@/components/Tabs.tsx";
import { NavigateBackLink } from "@/components/NavigateBackButton.tsx";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { format } from "date-fns";
import { TProjectsItem } from "@kyd/common/api";
import ProjectSettingsContent from "@/pages/Projects/Details/ProjectSettingsContent.tsx";
import CandidatesContent from "@/pages/Projects/Details/CandidatesContent.tsx";

type ProjectProfileParams = {
  id: string;
};

const getTabItems = (profile: TProjectsItem): TabItem[] => [
  {
    label: "Project Details",
    content: <ProjectSettingsContent profile={profile} />,
  },
  {
    label: "Candidates",
    content: <CandidatesContent profile={profile} />,
  },
];

export const ProjectProfile = () => {
  const { id } = useParams<ProjectProfileParams>();

  const query = useProjectProfileQuery({ projectId: id });

  return <ProjectPage query={query} />;
};

const ProjectPage = ({
  query: { data: profile, isError, isLoading },
}: {
  query: ReturnType<typeof useProjectProfileQuery>;
}) => {
  return (
    <>
      <Snackbar
        type="danger"
        msg="Failed to load project details."
        show={isError}
      />
      <NavigateBackLink />
      <BasePage isLoading={isLoading} isError={isError} showEmpty={!profile}>
        <BasePage.Header
          subtitle={`Created on ${profile ? format(new Date(profile.createdAt), "MMMM d, yyyy") : ""}`}
          title={profile?.name}
          icon={BusinessCenterIcon}
        />
        {profile && <Tabs tabs={getTabItems(profile)} />}
      </BasePage>
    </>
  );
};
