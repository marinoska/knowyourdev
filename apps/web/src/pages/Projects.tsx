import Stack from "@mui/joy/Stack";
import * as React from "react";
import { Snackbar } from "@/components/Snackbar.tsx";
import { BasePage } from "@/components/BasePage.tsx";
import { CircularProgress } from "@mui/joy";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import Container from "@/components/Container.tsx";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { ProjectItem } from "./ProjectItem";
import { ProjectModal } from "./ProjectModal";
import { useProjectsQuery } from "@/api/query/useProjectsQuery.ts";

export const Projects = () => {
  const [openProjectModal, setOpenProjectModal] = React.useState<boolean>(false);

  const {
    data: projects,
    isError,
    showError,
    dismissError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useProjectsQuery({ page: 1, limit: 300 });

  return (
    <>
      {showError && (
        <Snackbar
          type="danger"
          msg="Failed to load projects."
          onClose={dismissError}
        />
      )}
      <BasePage
        isLoading={isLoading}
        isError={isError}
        showEmpty={!projects?.length}
      >
        <BasePage.Header
          title="Projects"
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
              <ProjectItem 
                key={project._id} 
                item={{
                  _id: project._id,
                  name: project.name,
                  description: project.settings?.description || '',
                  createdAt: project.createdAt
                }} 
              />
            ))}
          </Sheet>

          {hasNextPage && (
            <Stack direction="row" justifyContent="center" padding={2}>
              <Button
                variant="solid"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <>
                    <CircularProgress size="sm" sx={{ marginRight: 1 }} />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </Stack>
          )}
        </Container>
      </BasePage>
      {openProjectModal && (
        <ProjectModal setOpen={setOpenProjectModal} open={openProjectModal} />
      )}
    </>
  );
};
