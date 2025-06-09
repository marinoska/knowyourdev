import Stack from "@mui/joy/Stack";
import { UploadedItem } from "./UploadedItem";
import UploadFile from "@mui/icons-material/Upload";
import * as React from "react";
import { UploadModal } from "./UploadModal.js";
import { useUploadsQuery } from "@/api/query/useUploadsQuery.ts";
import { Snackbar } from "@/components/Snackbar.tsx";
import { BasePage, Container } from "@/components/BasePage.tsx";
import { CircularProgress } from "@mui/joy";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";

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
  } = useUploadsQuery({ page: 1, limit: 300 });

  return (
    <>
      {showError && (
        <Snackbar
          type="danger"
          msg="Failed to load CV list."
          onClose={dismissError}
        />
      )}
      <BasePage
        isLoading={isLoading}
        isError={isError}
        showEmpty={!uploads?.length}
      >
        <BasePage.Header
          title="Uploaded CVs"
          buttonLabel="Upload CV"
          icon={UploadFile}
          action={() => setOpenUploadModal(true)}
        />
        <Container>
          <Sheet
            sx={{
              padding: 2,
              gap: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {uploads?.map((upload) => (
              <UploadedItem key={upload._id} item={upload} />
            ))}
          </Sheet>

          {hasNextPage && (
            <Stack direction="row" justifyContent="center" padding={2}>
              <Button
                variant="solid"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <>
                    <CircularProgress size="sm" sx={{ marginRight: 1 }} />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </Stack>
          )}
        </Container>
      </BasePage>
      {openUploadModal && (
        <UploadModal setOpen={setOpenUploadModal} open={openUploadModal} />
      )}
    </>
  );
};
