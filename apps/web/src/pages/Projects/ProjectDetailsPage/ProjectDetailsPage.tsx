import { Snackbar } from "@/components/Snackbar.tsx";
import { useProjectProfileQuery } from "@/api/query/useProjectsQuery.ts";
import { useParams } from "react-router-dom";
import { BasePage } from "@/components/BasePage.tsx";
import Tabs, { TabsRecord } from "@/components/Tabs.tsx";
import { format } from "date-fns";
import { ProjectSettingsTab } from "@/pages/Projects/ProjectDetailsPage/ProjectSettingsTab.tsx";
import CandidatesTab from "@/pages/Projects/ProjectDetailsPage/CandidatesTab.tsx";
import { useState } from "react";
import { UploadButton } from "@/components/UploadButton.tsx";
import { TProjectDTO } from "@/api/query/types.ts";

import { usePageContext } from "@/core/contexts/UsePageContext.tsx";
import Stack from "@mui/joy/Stack";
import { Button } from "@mui/joy";

type ProjectProfileParams = { id: string };

const getTabItems = (project: TProjectDTO): TabsRecord => ({
  settings: {
    label: "Project Details",
    content: <ProjectSettingsTab defaultProject={project} />,
  },
  candidates: {
    label: "Candidates",
    content: <CandidatesTab project={project} />,
  },
});

export const ProjectDetailsPage = () => {
  const { id } = useParams<ProjectProfileParams>();

  const {
    data: profile,
    isError,
    isLoading,
  } = useProjectProfileQuery({ projectId: id });

  const [activeTab, setActiveTab] = useState(0);
  const { headerState } = usePageContext();

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

export const FormActions = ({
  disabled,
  isLoading,
  reset,
  submit,
}: {
  disabled: boolean;
  isLoading: boolean;
  reset: VoidFunction | null;
  submit: VoidFunction | null;
}) => {
  return (
    <Stack direction="row" gap={2} justifyContent="end">
      <Button
        type="submit"
        color="primary"
        disabled={disabled}
        loading={isLoading}
        onClick={submit ? submit : () => {}}
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
      <Button
        type="button"
        color="neutral"
        variant="outlined"
        onClick={reset ? reset : () => {}}
        disabled={disabled}
      >
        Reset
      </Button>
    </Stack>
  );
};
