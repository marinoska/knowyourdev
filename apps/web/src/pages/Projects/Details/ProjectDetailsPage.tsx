import { Snackbar } from "@/components/Snackbar.tsx";
import { useProjectProfileQuery } from "@/api/query/useProjectsQuery.ts";
import { useParams } from "react-router-dom";
import { BasePage } from "@/components/BasePage.tsx";
import Tabs, { TabsRecord } from "@/components/Tabs.tsx";
import { format } from "date-fns";
import {
  FormActions,
  ProjectSettingsContent,
} from "@/pages/Projects/Details/ProjectSettingsContent.tsx";
import CandidatesContent from "@/pages/Projects/Details/CandidatesContent.tsx";
import { useState } from "react";
import { UploadButton } from "@/components/UploadButton.tsx";
import { TProjectDTO } from "@/api/query/types.ts";

import { usePageContext } from "@/core/contexts/UsePageContext.tsx";

type ProjectProfileParams = { id: string };

const getTabItems = (project: TProjectDTO): TabsRecord => ({
  settings: {
    label: "Project Details",
    content: <ProjectSettingsContent defaultProject={project} />,
  },
  candidates: {
    label: "Candidates",
    content: <CandidatesContent project={project} />,
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
  const { headerState } = usePageContext();
  console.log({ headerState });
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
          {activeTab === 0 && profile && <FormActions {...headerState} />}
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
