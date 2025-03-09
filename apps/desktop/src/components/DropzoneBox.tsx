import { useDropzone } from 'react-dropzone';
import Typography from '@mui/joy/Typography';
import Stack from "@mui/joy/Stack";
import CloudUpload from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import Button from "@mui/joy/Button";
import { useState } from "react";
import { SnackbarMsg } from "./SnackbarMsg.js";
import { StateSetter } from "../types.js";
import { Alert } from "@mui/joy";

const THREE_MB = 3145728;

export const DropzoneBox = ({file, setFile}: { file: File | null; setFile: StateSetter<File | null> }) => {
    const [error, setError] = useState('');

    const validateFileContent = (file: File): Promise<boolean> => {
        return new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                const content = event.target?.result;

                if (file.type === 'application/pdf') {
                    // Basic PDF Validation: Check for "%PDF" marker
                    const isPDF = (content as string).includes("%PDF-");
                    resolve(isPDF);
                } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    // DOCX Validation: Ensure it is a valid ZIP archive
                    const isDOCX = (content as ArrayBuffer)?.byteLength > 0;
                    resolve(isDOCX);
                } else {
                    resolve(false); // Unrecognized type = invalid
                }
            };

            // Read file as ArrayBuffer to check binary contents
            if (file.type === 'application/pdf' || file.type === 'application/msword') {
                reader.readAsText(file); // Read text content for PDFs or DOC
            } else {
                reader.readAsArrayBuffer(file); // Binary content for DOCX
            }
        });
    };

    const onDrop = async (acceptedFiles: File[]) => {
        console.log(acceptedFiles); // Handle the dropped files
        if (acceptedFiles.length > 1) {
            console.log('Only one file can be uploaded.');
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

    const {getRootProps, getInputProps, open} = useDropzone({
        onDrop, multiple: false, noClick: true, accept: {        // Restrict file formats
            'application/pdf': ['.pdf'],            // PDFs
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxSize: THREE_MB,
    });

    return (<>
            <Stack gap="4"
                   {...getRootProps()}
                   sx={{
                       p: 2,
                       width: 400,
                       minHeight: 200,
                       border: '2px dashed',
                       borderRadius: 'md',
                       alignItems: 'center',
                       justifyContent: 'center',
                   }}
            >
                <Typography level="h2">
                    <CloudUpload/>
                </Typography>
                {file ?
                    <Alert variant="soft"
                           color="neutral"
                           endDecorator={
                               <Button size="sm" variant="solid" onClick={() => setFile(null)} color="primary">
                                   <CloseIcon/>
                               </Button>
                           }><Typography
                        fontWeight="300">
                        {file.name}
                    </Typography>
                    </Alert> :
                    (<><Typography level="body-sm">
                        Drag & drop a CV or
                    </Typography>
                        <input {...getInputProps()} />
                        <Button size="lg" sx={{m: 1}} color="secondary" onClick={open}>Browse
                            Files</Button>
                        <Typography level="body-xs">
                            Supported formats: PDF, DOCX (Max 3MB)
                        </Typography></>)

                }
            </Stack>

            <SnackbarMsg msg={error} onClose={() => setError('')}/>
        </>
    );
};
