import { BasePage } from "@/components/BasePage.tsx";
import Tabs, { TabsRecord } from "@/components/Tabs.tsx";
import { format } from "date-fns";
import { ProjectSettingsTab } from "@/pages/Projects/ProjectDetailsPage/ProjectSettingsTab.tsx";
import CandidatesTab from "@/pages/Projects/ProjectDetailsPage/CandidatesTab.tsx";
import { useState } from "react";
import { UploadButton } from "@/components/UploadButton.tsx";
import { usePageContext } from "@/core/contexts/UsePageContext.tsx";
import Stack from "@mui/joy/Stack";
import { Button } from "@mui/joy";
import { useProjectSettingsFormContext } from "../ProjectSettingsFormContext.tsx";

const getTabItems = (): TabsRecord => ({
  settings: {
    label: "Project Details",
    content: <ProjectSettingsTab />,
  },
  candidates: {
    label: "Candidates",
    content: <CandidatesTab />,
  },
});

export const ProjectDetailsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { headerState } = usePageContext();
  const { project } = useProjectSettingsFormContext();

  return (
    <>
      <BasePage.Header
        showBackButton
        subtitle={`Created on ${format(new Date(project.createdAt), "MMMM d, yyyy")}`}
        title={project.name}
      >
        {activeTab === 0 && <FormActions {...headerState} />}
        {activeTab === 1 && <UploadButton projectId={project._id} />}
      </BasePage.Header>
      <Tabs tabs={getTabItems()} onTabChange={setActiveTab} />
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
  const { isRegenerating } = useProjectSettingsFormContext();
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
        disabled={isRegenerating}
      >
        Reset
      </Button>
    </Stack>
  );
};
