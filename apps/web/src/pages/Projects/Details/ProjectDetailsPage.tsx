import { Snackbar } from "@/components/Snackbar.tsx";
import { useProjectProfileQuery } from "@/api/query/useProjectsQuery.ts";
import { useParams } from "react-router-dom";
import { BasePage } from "@/components/BasePage.tsx";
import Tabs, { TabsRecord } from "@/components/Tabs.tsx";
import { format } from "date-fns";
import { TProjectsItem } from "@kyd/common/api";
import ProjectSettingsContent from "@/pages/Projects/Details/ProjectSettingsContent.tsx";
import CandidatesContent from "@/pages/Projects/Details/CandidatesContent.tsx";
import { useState } from "react";
import { UploadButton } from "@/components/UploadButton.tsx";

type ProjectProfileParams = {
  id: string;
};

const getTabItems = (profile: TProjectsItem): TabsRecord => ({
  settings: {
    label: "Project Details",
    content: <ProjectSettingsContent profile={profile} />,
  },
  candidates: {
    label: "Candidates",
    content: <CandidatesContent project={profile} />,
  },
});

export const ProjectDetailsPage = () => {
  const { id } = useParams<ProjectProfileParams>();

  const query = useProjectProfileQuery({ projectId: id });

  return <ProjectPage query={query} />;
};

const ProjectPage = ({
  query: { data: profile, isError, isLoading },
}: {
  query: ReturnType<typeof useProjectProfileQuery>;
}) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Snackbar
        type="danger"
        msg="Failed to load project details."
        show={isError}
      />
      <BasePage isLoading={isLoading} isError={isError} showEmpty={!profile}>
        <BasePage.Header
          showBackButton
          subtitle={`Created on ${profile ? format(new Date(profile.createdAt), "MMMM d, yyyy") : ""}`}
          title={profile?.name}
        >
          {activeTab === 1 && profile && (
            <UploadButton projectId={profile._id} />
          )}
        </BasePage.Header>
        {profile && (
          <Tabs tabs={getTabItems(profile)} onTabChange={setActiveTab} />
        )}
      </BasePage>
    </>
  );
};
