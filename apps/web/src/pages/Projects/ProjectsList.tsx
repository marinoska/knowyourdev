import * as React from "react";
import { Snackbar } from "@/components/Snackbar.tsx";
import { BasePage } from "@/components/BasePage.tsx";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import { ProjectItem } from "./ProjectItem.tsx";
import { ProjectModal } from "./ProjectModal.tsx";
import { useProjectsQuery } from "@/api/query/useProjectsQuery.ts";
import { LoadMoreButton } from "@/components/LoadMoreButton.tsx";
import Button from "@mui/joy/Button";
import { Stack } from "@mui/joy";

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
        <BasePage.Header title="ProjectsList">
          <Button
            onClick={() => setOpenProjectModal(true)}
            startDecorator={<BusinessCenterIcon />}
            size="md"
          >
            Create Project
          </Button>
        </BasePage.Header>
        <BasePage.Content>
          <BasePage.Sheet>
            <Stack gap={2} direction="column">
              {projects?.map((project) => (
                <ProjectItem key={project._id} item={project} />
              ))}
            </Stack>
          </BasePage.Sheet>

          <LoadMoreButton
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            hasNextPage={hasNextPage}
          />
        </BasePage.Content>
      </BasePage>
      {openProjectModal && (
        <ProjectModal setOpen={setOpenProjectModal} open={openProjectModal} />
      )}
    </>
  );
};
