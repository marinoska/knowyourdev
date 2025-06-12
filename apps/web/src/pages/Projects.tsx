import Stack from "@mui/joy/Stack";
import * as React from "react";
import { Snackbar } from "@/components/Snackbar.tsx";
import { BasePage } from "@/components/BasePage.tsx";
import { CircularProgress } from "@mui/joy";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import Container from "@/components/Container.tsx";
import FolderIcon from "@mui/icons-material/Folder";
import { ProjectItem } from "./ProjectItem";
import { ProjectModal } from "./ProjectModal";

export const Projects = () => {
  const [openProjectModal, setOpenProjectModal] = React.useState<boolean>(false);
  const [projects, setProjects] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [hasNextPage, setHasNextPage] = React.useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = React.useState(false);

  // Mock data for initial implementation
  React.useEffect(() => {
    // In a real implementation, this would be replaced with an API call
    setProjects([
      { _id: "1", name: "Project 1", description: "Description for Project 1", createdAt: new Date().toISOString() },
      { _id: "2", name: "Project 2", description: "Description for Project 2", createdAt: new Date().toISOString() },
    ]);

    // Simulate having more pages
    setHasNextPage(page < 3);
  }, [page]);

  const dismissError = () => {
    setShowError(false);
  };

  const fetchNextPage = () => {
    setIsFetchingNextPage(true);
    // Simulate API call delay
    setTimeout(() => {
      setPage(prevPage => prevPage + 1);
      setIsFetchingNextPage(false);

      // Add more mock projects when loading next page
      setProjects(prevProjects => [
        ...prevProjects,
        { _id: `${prevProjects.length + 1}`, name: `Project ${prevProjects.length + 1}`, description: `Description for Project ${prevProjects.length + 1}`, createdAt: new Date().toISOString() },
        { _id: `${prevProjects.length + 2}`, name: `Project ${prevProjects.length + 2}`, description: `Description for Project ${prevProjects.length + 2}`, createdAt: new Date().toISOString() },
      ]);

      // Update hasNextPage based on the new page number
      setHasNextPage(page + 1 < 3);
    }, 1000);
  };

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
          icon={FolderIcon}
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
