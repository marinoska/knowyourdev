import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import { StateSetter } from "../../types.ts";
import Divider from "@mui/joy/Divider";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import { FormLabel, Input, Textarea } from "@mui/joy";
import { useEffect, useState } from "react";
import { Snackbar } from "../../components/Snackbar.tsx";

export const ProjectModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: StateSetter<boolean>;
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Mock project creation - in a real app, this would use a mutation hook
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const reset = () => {
    setIsError(false);
    setIsSuccess(false);
  };

  const handleCreateProject = () => {
    setIsPending(true);
    // Simulate API call
    setTimeout(() => {
      setIsPending(false);
      setIsSuccess(true);
      // In a real app, this would create a project via API
      console.log("Creating project:", { name, description });
    }, 1000);
  };

  useEffect(() => {
    isSuccess && setOpen(false);
  }, [isSuccess, setOpen]);

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
        {isError && (
          <Snackbar
            msg="Failed to create project"
            type={"danger"}
            onClose={() => reset()}
          />
        )}
        {isSuccess && (
          <Snackbar
            msg="Project created successfully"
            type={"success"}
            onClose={() => reset()}
          />
        )}

        <Sheet
          variant="outlined"
          sx={{ maxWidth: 800, borderRadius: "md", boxShadow: "lg" }}
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

            <FormLabel
              id="project-description-label"
              htmlFor="project-description"
            >
              Description
            </FormLabel>
            <Textarea
              id="project-description"
              placeholder="Enter project description"
              minRows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
