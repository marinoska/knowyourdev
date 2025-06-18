import * as React from "react";
import Button from "@mui/joy/Button";
import UploadFile from "@mui/icons-material/Upload";
import { UploadModal } from "@/pages/components/UploadModal.tsx";

interface UploadButtonProps {
  projectId?: string;
  buttonText?: string;
  size?: "sm" | "md" | "lg";
}

export const UploadButton: React.FC<UploadButtonProps> = ({
  projectId,
  buttonText = "Upload CV",
  size = "md",
}) => {
  const [openUploadModal, setOpenUploadModal] = React.useState<boolean>(false);

  return (
    <>
      <Button 
        onClick={() => setOpenUploadModal(true)} 
        startDecorator={<UploadFile />} 
        size={size}
      >
        {buttonText}
      </Button>
      
      {openUploadModal && (
        <UploadModal 
          setOpen={setOpenUploadModal} 
          open={openUploadModal} 
          projectId={projectId}
        />
      )}
    </>
  );
};

export default UploadButton;