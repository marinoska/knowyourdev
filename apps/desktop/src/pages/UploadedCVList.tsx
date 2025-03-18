import { PageHeader } from "./PageHeader";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";
import { UploadedItem } from "./UploadedItem";
import UploadFile from '@mui/icons-material/Upload';
import * as React from "react";
import { UploadModal } from "./UploadModal.js";
import { useUploadsListQuery } from "@/api/query/useUploadsListQuery.ts";
import { Snackbar } from "@/components/Snackbar.tsx";
import { CircularProgress } from "@mui/joy";

export const UploadedCVList = () => {
    const [openUploadModal, setOpenUploadModal] = React.useState<boolean>(false);

    const {data: uploads, isLoading, showError, dismissError} = useUploadsListQuery();

    return (<>
            {showError && <Snackbar type="danger" msg="Failed to load CV list." onClose={dismissError}/>}
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
                        {isLoading &&
                            (<Box sx={{alignItems: 'center', justifyContent: 'center', display: 'flex',}}>
                                <CircularProgress size="lg"/>
                            </Box>)}
                        {uploads?.map((upload) => (
                            <UploadedItem key={upload._id} item={upload}/>
                        ))}
                    </Stack>

                </Box>

            </Sheet>
            {openUploadModal && <UploadModal setOpen={setOpenUploadModal} open={openUploadModal}/>}
        </>
    )
}