import { Outlet, useParams } from "react-router-dom";
import { Snackbar } from "@/components/Snackbar.tsx";
import { BasePage } from "@/components/BasePage.tsx";
import { useProjectProfileQuery } from "@/api/query/useProjectsQuery.ts";
import { ProjectSettingsFormProvider } from "@/pages/Projects/ProjectSettingsFormProvider.tsx";

type ProjectProfileParams = { id: string };

export const ProjectPageLayout = () => {
  const { id } = useParams<ProjectProfileParams>();
  const {
    data: profile,
    isLoading,
    isError,
  } = useProjectProfileQuery({ projectId: id });

  return (
    <>
      <Snackbar type="danger" msg="Failed to load project details." show={isError} />
      <BasePage isLoading={isLoading} isError={isError} showEmpty={!profile}>
        {profile ? (
          <ProjectSettingsFormProvider defaultProject={profile}>
            <Outlet />
          </ProjectSettingsFormProvider>
        ) : null}
      </BasePage>
    </>
  );
};
