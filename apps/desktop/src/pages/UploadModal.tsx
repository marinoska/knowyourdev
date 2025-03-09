import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { StateSetter } from "../types.js";
import { DropzoneBox } from "../components/DropzoneBox";
import Divider from "@mui/joy/Divider";
import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import { Alert, FormLabel, Input } from "@mui/joy";
import { useState } from "react";

export const UploadModal = ({open, setOpen}: {
    open: boolean,
    setOpen: StateSetter<boolean>
}) => {
    const [file, setFile] = useState<File | null>(null);

    return (
        <Modal
            open={open}
            hideBackdrop={true}
            onClose={() => setOpen(false)}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        ><>
            <Sheet
                variant="outlined"
                sx={{maxWidth: 500, borderRadius: 'md', boxShadow: 'lg'}}
            >
                <Box sx={{m: 3}}>
                    <ModalClose variant="plain" sx={{m: 1}} onClick={() => setOpen(false)}/>
                    <Typography
                        component="h2"
                        level="h4"
                        sx={{fontWeight: 'lg', mb: 1}}
                    >
                        Upload new CV
                    </Typography>
                </Box>
                <Divider sx={{my: 2}}/>
                <Stack gap={2} sx={{m: 3}}>
                    <DropzoneBox file={file} setFile={setFile}/>

                    <FormLabel id="custom-name-label" htmlFor="custom-name">Custom Name</FormLabel>
                    <Input id="custom-name" placeholder="e.g., John Smith - Senior Developer"/>
                    <FormLabel id="applied-label">Applied For</FormLabel>
                    <Input id="applied" placeholder="e.g., Engineer for MVP"/>
                </Stack>

                <Divider sx={{my: 2}}/>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
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
                        size="md"
                        variant="solid"
                        color="primary"
                        onClick={() => {
                        }}
                    >
                        Proceed
                    </Button>
                </Box>

            </Sheet>
        </>
        </Modal>
    );
}
