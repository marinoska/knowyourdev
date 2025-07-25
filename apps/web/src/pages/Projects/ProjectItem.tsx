import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import Stack from "@mui/joy/Stack";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { BasePage } from "@/components/BasePage";
import { Regular, Smallest } from "@/components/typography.tsx";
import { TProjectDTO } from "@/api/query/types.ts";
import Chip from "@mui/joy/Chip";
import { SCOPE_NAMES, ScopeType } from "@kyd/common/api";
import { MouseEvent, useState } from "react";
import Modal from "@mui/joy/Modal";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import { useProjectDeleteMutation } from "@/api/query/useProjectDeleteMutation.ts";

export const ProjectItem = ({ item }: { item: TProjectDTO }) => {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutate: deleteProject, isPending } = useProjectDeleteMutation();

  const { name, createdAt, _id } = item;

  const handleDeleteClick = (e: MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the delete icon
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteProject(_id, {
      onSuccess: () => {
        setConfirmOpen(false);
      },
      onError: (error) => {
        console.error("Failed to delete project:", error);
        setConfirmOpen(false);
      },
    });
  };

  return (
    <>
      <BasePage.ListItem id={_id} onClick={() => navigate(`/projects/${_id}`)}>
        <Regular>
          <BusinessCenterIcon />
        </Regular>
        <Stack sx={{ flexGrow: 1 }}>
          <Stack direction="row" gap={2} flexWrap="wrap" alignItems="center">
            <Regular>{name}</Regular>
            <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
              {item.settings?.techFocus?.map((scope: ScopeType) => (
                <Chip size="md" variant="outlined" color="primary" key={scope}>
                  {SCOPE_NAMES[scope]}
                </Chip>
              ))}
            </Stack>
          </Stack>
          <Smallest>
            Created on {format(new Date(createdAt), "MMMM d, yyyy")}
          </Smallest>
        </Stack>
        <IconButton
          variant="plain"
          color="neutral"
          onClick={handleDeleteClick}
          sx={{ ml: "auto" }}
        >
          <DeleteIcon />
        </IconButton>
      </BasePage.ListItem>

      {/* Confirmation Dialog */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 500,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <Typography level="h4" component="h2" sx={{ mb: 2 }}>
            Confirm Delete
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography sx={{ mb: 3 }}>
            Are you sure you want to delete project "{name}"? This action cannot
            be undone.
          </Typography>
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="danger"
              onClick={handleConfirmDelete}
              loading={isPending}
            >
              Delete
            </Button>
          </Box>
        </Sheet>
      </Modal>
    </>
  );
};
