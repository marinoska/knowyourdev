import * as React from "react";
import { Snackbar } from "@/components/Snackbar.tsx";
import { BasePage } from "@/components/BasePage.tsx";
import Sheet from "@mui/joy/Sheet";
import Container from "@/components/Container.tsx";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { ProjectItem } from "./ProjectItem.tsx";
import { ProjectModal } from "./ProjectModal.tsx";
import { useProjectsQuery } from "@/api/query/useProjectsQuery.ts";
import { LoadMoreButton } from "@/components/LoadMoreButton.tsx";

export const ProjectsList = () => {
  const [openProjectModal, setOpenProjectModal] =
    React.useState<boolean>(false);

  const {
    data: projects,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProjectsQuery({ page: 1, limit: 300 });

  return (
    <>
      <Snackbar type="danger" msg="Failed to load projects." show={isError} />
      <BasePage
        isLoading={isLoading}
        isError={isError}
        showEmpty={!projects?.length}
      >
        <BasePage.Header
          title="ProjectsList"
          buttonLabel="Create Project"
          icon={BusinessCenterIcon}
          action={() => setOpenProjectModal(true)}
        />
        <Container>
          <Sheet
            sx={{
              padding: 2,
              gap: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {projects?.map((project) => (
              <ProjectItem key={project._id} item={project} />
            ))}
          </Sheet>

          <LoadMoreButton
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            hasNextPage={hasNextPage}
          />
        </Container>
      </BasePage>
      {openProjectModal && (
        <ProjectModal setOpen={setOpenProjectModal} open={openProjectModal} />
      )}
    </>
  );
};
