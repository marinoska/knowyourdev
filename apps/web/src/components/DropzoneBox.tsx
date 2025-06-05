import { useDropzone } from "react-dropzone";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import CloudUpload from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/joy/Button";
import { useState } from "react";
import { Snackbar } from "./Snackbar.tsx";
import { StateSetter } from "../types.js";
import { Alert } from "@mui/joy";
import { validateFileContent } from "../utils/files.js";
import { MAXIMUM_UPLOAD_SIZE_BYTES } from "@/utils/const.ts";

export const DropzoneBox = ({
  file,
  setFile,
}: {
  file: File | null;
  setFile: StateSetter<File | null>;
}) => {
  const [error, setError] = useState("");

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 1) {
      console.log("Only one file can be uploaded.");
      return;
    }

    const isValid = await validateFileContent(acceptedFiles[0]);
    if (isValid) {
      setError("");
      setFile(acceptedFiles[0]);
    } else {
      setError(`Invalid file content: ${acceptedFiles[0].name}`);
      setFile(null);
    }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
    accept: {
      // Restrict file formats
      "application/pdf": [".pdf"], // PDFs
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxSize: MAXIMUM_UPLOAD_SIZE_BYTES,
  });

  return (
    <>
      <Stack
        gap="4"
        {...getRootProps()}
        sx={{
          p: 2,
          width: 600,
          minHeight: 200,
          border: "2px dashed",
          borderRadius: "md",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography level="h2">
          <CloudUpload />
        </Typography>
        {file ? (
          <Alert
            variant="soft"
            color="neutral"
            endDecorator={
              <Button
                size="sm"
                variant="solid"
                onClick={() => setFile(null)}
                color="secondary"
              >
                <CloseIcon />
              </Button>
            }
          >
            <Typography fontWeight="300">{file.name}</Typography>
          </Alert>
        ) : (
          <>
            <Typography level="body-sm">Drag & drop a CV or</Typography>
            <input {...getInputProps()} />
            <Button size="lg" sx={{ m: 1 }} color={"secondary"} onClick={open}>
              Browse Files
            </Button>
            <Typography level="body-xs">
              Supported formats: PDF, DOCX (Max 3MB)
            </Typography>
          </>
        )}
      </Stack>

      <Snackbar msg={error} onClose={() => setError("")} />
    </>
  );
};
