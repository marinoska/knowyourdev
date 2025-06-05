import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import { StateSetter } from "../types.js";
import { DropzoneBox } from "../components/DropzoneBox";
import Divider from "@mui/joy/Divider";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import { FormLabel, Input } from "@mui/joy";
import { useEffect, useState } from "react";
import { useUploadMutation } from "../api/query/useUploadMutation.js";
import { Snackbar } from "../components/Snackbar.tsx";

export const UploadModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: StateSetter<boolean>;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const { isPending, isError, isSuccess, reset, handleFileUpload } =
    useUploadMutation();

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
            msg="Failed file uploading"
            type={"danger"}
            onClose={() => reset()}
          />
        )}
        {isSuccess && (
          <Snackbar
            msg="File uploded successfully"
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
              Upload new CV
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Stack gap={2} sx={{ m: 3 }}>
            <DropzoneBox file={file} setFile={setFile} />

            <FormLabel id="custom-name-label" htmlFor="custom-name">
              Custom Name
            </FormLabel>
            <Input
              id="custom-name"
              placeholder="e.g., John Smith - Senior Developer"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FormLabel id="applied-label">Applied For</FormLabel>
            <Input
              id="applied"
              placeholder="e.g., Engineer for MVP"
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
              disabled={!file}
              loading={isPending}
              size="md"
              variant="solid"
              color="primary"
              onClick={() => {
                if (!file) return;
                handleFileUpload(file, name, role);
              }}
            >
              Proceed
            </Button>
          </Box>
        </Sheet>
      </>
    </Modal>
  );
};
