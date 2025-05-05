import { PageHeader } from "./PageHeader";
import Stack from "@mui/joy/Stack";
import { UploadedItem } from "./UploadedItem";
import UploadFile from '@mui/icons-material/Upload';
import * as React from "react";
import { UploadModal } from "./UploadModal.js";
import { useUploadsQuery } from "@/api/query/useUploadsQuery.ts";
import { Snackbar } from "@/components/Snackbar.tsx";
import { BasePage } from "@/components/BasePage.tsx";
import { useMemo } from "react";

export const UploadedList = () => {
    const [openUploadModal, setOpenUploadModal] = React.useState<boolean>(false);

    const {data, isLoading, isError, showError, dismissError} = useUploadsQuery({page: 1, limit: 3});

    const header = useMemo(() => (<PageHeader title="Uploaded CVs" buttonLabel="Upload CV" icon={UploadFile}
                                              action={() => setOpenUploadModal(true)}/>), [])
    return (<>
        {showError && <Snackbar type="danger" msg="Failed to load CV list." onClose={dismissError}/>}
        <BasePage isLoading={isLoading} isError={isError} showEmpty={!data?.pages?.length} header={header}>
            <Stack spacing={2}>
                {data?.pages[0].uploads?.map((upload) => (
                    <UploadedItem key={upload._id} item={upload}/>
                ))}
            </Stack>

        </BasePage>
        {openUploadModal && <UploadModal setOpen={setOpenUploadModal} open={openUploadModal}/>}
    </>)
}