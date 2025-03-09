import { PageHeader } from "./PageHeader";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import { UploadedItem } from "./UploadedItem";
import UploadFile from '@mui/icons-material/Upload';
import * as React from "react";
import { UploadModal } from "./UploadModal.js";

export const UploadedCVList = () => {
    const [openUploadModal, setOpenUploadModal] = React.useState<boolean>(false);

    return (<>
            <Sheet sx={{
                // width: 'fit-content',
                // minWidth: {
                //     xs: 'auto', // No minimum width on small screens
                //     md: '800px', // Minimum width of 400px for desktop (from "md" breakpoint)
                // },
                maxWidth: "1000px",
                mt: 3,
                borderRadius: "sm",
            }}>
                <PageHeader title="Uploaded CVs" buttonLabel="Upload CV" icon={UploadFile}
                            action={() => setOpenUploadModal(true)}/>
                <Box sx={{m: 3}}>
                    <Stack spacing={2}>
                        <UploadedItem title="Michael Chen - Frontend Developer" date={new Date()}/>
                        <UploadedItem title="Sarah Johnson - Full Stack Developer" date={new Date()}/>
                        <UploadedItem title="David Kim - Backend Developer" date={new Date()}/>
                    </Stack>
                </Box>

            </Sheet>
            {openUploadModal && <UploadModal setOpen={setOpenUploadModal} open={openUploadModal}/>}
        </>
    )
}