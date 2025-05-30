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
import { CircularProgress } from "@mui/joy";
import Button from "@mui/joy/Button";

export const UploadedList = () => {
    const [openUploadModal, setOpenUploadModal] = React.useState<boolean>(false);

    const {
        data: uploads,
        isLoading,
        isError,
        showError,
        dismissError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useUploadsQuery({page: 1, limit: 300});

    const header = useMemo(() => (<PageHeader title="Uploaded CV list" buttonLabel="Upload CV" icon={UploadFile}
                                              action={() => setOpenUploadModal(true)}/>), [])
    return (<>
        {showError && <Snackbar type="danger" msg="Failed to load CV list." onClose={dismissError}/>}
        <BasePage isLoading={isLoading} isError={isError} showEmpty={!uploads?.length} header={header}>
            <Stack spacing={2}>
                {uploads?.map((upload) => (
                    <UploadedItem key={upload._id} item={upload}/>
                ))}
            </Stack>

            {hasNextPage && (
                <Stack direction="row" justifyContent="center" padding={2}>
                    <Button
                        variant="solid"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                    >
                        {isFetchingNextPage ? (
                            <>
                                <CircularProgress size="sm" sx={{marginRight: 1}}/>
                                Loading...
                            </>
                        ) : (
                            "Load More"
                        )}
                    </Button>
                </Stack>
            )}

        </BasePage>
        {openUploadModal && <UploadModal setOpen={setOpenUploadModal} open={openUploadModal}/>}
    </>)
}