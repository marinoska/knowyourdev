import { Snackbar } from "@/components/Snackbar.tsx";
import { PageHeader } from "@/pages/PageHeader.tsx";
import UploadFile from "@mui/icons-material/Upload";
import * as React from "react";
import { useUploadProfileQuery } from "@/api/query/useUploadListQuery.ts";
import Sheet from "@mui/joy/Sheet";
import CenteredLoader from "@/components/Loader.tsx";
import { useParams } from "react-router-dom";

type UploadedCVProfileParams = {
    id: string;
};
export const UploadedCVProfile = () => {
    const {id} = useParams<UploadedCVProfileParams>();
    console.log({id});
    const {data: upload, isLoading, showError, dismissError} = useUploadProfileQuery({uploadId: id || ''});

    if (isLoading) {
        return <CenteredLoader/>;
    }

    return (<>
        {showError && <Snackbar type="danger" msg="Failed to load CV list." onClose={dismissError}/>}
        <Sheet sx={{
            width: 'fit-content',
            // minWidth: {
            //     xs: 'auto', // No minimum width on small screens
            //     md: '800px', // Minimum width of 400px for desktop (from "md" breakpoint)
            // },
            // maxWidth: "1000px",
            mt: 3,
            borderRadius: "sm",
        }}>
            <PageHeader title="Uploaded CVs"/>
        </Sheet>
    </>)
}