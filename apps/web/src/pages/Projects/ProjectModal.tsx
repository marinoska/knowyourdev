import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import { StateSetter } from "../../types.ts";
import Divider from "@mui/joy/Divider";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import { FormLabel, Input } from "@mui/joy";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar } from "../../components/Snackbar.tsx";
import { useProjectCreateMutation } from "@/api/query/useProjectCreateMutation.ts";

export const ProjectModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: StateSetter<boolean>;
}) => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const {
    mutate: handleProjectCreate,
    isPending,
    isError,
    isSuccess,
    data: createdProject,
  } = useProjectCreateMutation();

  const handleCreateProject = () => {
    handleProjectCreate(
      { name },
      {
        onError: (error) => {
          console.error("Failed to create project:", error);
        },
      },
    );
  };

  useEffect(() => {
    if (isSuccess && createdProject) {
      setOpen(false);
      navigate(`/projects/${createdProject._id}`);
    }
  }, [isSuccess, createdProject, setOpen, navigate]);

  return (
    <Modal
      open={open}
      hideBackdrop={true}
      onClose={() => setOpen(false)}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <>
        <Snackbar msg="Failed to create project" type="danger" show={isError} />
        <Snackbar
          msg="Project created successfully"
          type="success"
          show={isSuccess}
        />
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 800,
            minWidth: 500,
            borderRadius: "md",
            boxShadow: "lg",
          }}
        >
          <Box sx={{ m: 3 }}>
            <ModalClose
              variant="plain"
              sx={{ m: 1 }}
              onClick={() => setOpen(false)}
            />
            <Typography
              component="h2"
              level="h4"
              sx={{ fontWeight: "lg", mb: 1 }}
            >
              Create New Project
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Stack gap={2} sx={{ m: 3 }}>
            <FormLabel id="project-name-label" htmlFor="project-name">
              Project Name
            </FormLabel>
            <Input
              id="project-name"
              placeholder="e.g., New Client Website"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

          </Stack>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              m: 3,
            }}
          >
            <Button
              size="md"
              variant="plain"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={!name.trim()}
              loading={isPending}
              size="md"
              variant="solid"
              color="primary"
              onClick={handleCreateProject}
            >
              Create Project
            </Button>
          </Box>
        </Sheet>
      </>
    </Modal>
  );
};
