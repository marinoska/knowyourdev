import { Snackbar } from "@/components/Snackbar.tsx";
import { useProjectProfileQuery } from "@/api/query/useProjectsQuery.ts";
import { useParams } from "react-router-dom";
import { BasePage } from "@/components/BasePage.tsx";
import Tabs, { TabItem } from "@/components/Tabs.tsx";
import { NavigateBackLink } from "@/components/NavigateBackButton.tsx";
import UploadIcon from "@mui/icons-material/Upload";
import { format } from "date-fns";
import { TProjectsItem } from "@kyd/common/api";
import ProjectSettingsContent from "@/pages/Projects/Details/ProjectSettingsContent.tsx";
import CandidatesContent from "@/pages/Projects/Details/CandidatesContent.tsx";
import { useMemo, useState } from "react";
import Button from "@mui/joy/Button";

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
    content: <CandidatesContent project={profile} />,
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
  const [activeTab, setActiveTab] = useState(0);
  // const [openUploadModal, setOpenUploadModal] = React.useState<boolean>(false);

  const tabConfigs = useMemo(
    () => [
      {
        // No button for Project Details tab
      },
      {
        buttonLabel: "Upload CV",
        icon: UploadIcon,
        action: () => {
          console.log("Upload CV clicked");
        },
      },
    ],
    [],
  );

  const renderButton = () => {
    const activeConfig = tabConfigs[activeTab];
    if (!activeConfig || !activeConfig.buttonLabel) return null;

    const { buttonLabel, icon: Icon, action } = activeConfig;
    return (
      <Button onClick={action} startDecorator={Icon && <Icon />} size="md">
        {buttonLabel}
      </Button>
    );
  };

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
        >
          {renderButton()}
        </BasePage.Header>
        {profile && (
          <Tabs tabs={getTabItems(profile)} onTabChange={setActiveTab} />
        )}
      </BasePage>
    </>
  );
};
