import Stack from "@mui/joy/Stack";
import { UploadedItem } from "./UploadedItem.tsx";
import UploadFile from "@mui/icons-material/Upload";
import * as React from "react";
import { UploadModal } from "./UploadModal.tsx";
import { useUploadsQuery } from "@/api/query/useUploadsQuery.ts";
import { Snackbar } from "@/components/Snackbar.tsx";
import { BasePage } from "@/components/BasePage.tsx";
import { CircularProgress } from "@mui/joy";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import Container from "@/components/Container.tsx";

export const UploadedList = () => {
  const [openUploadModal, setOpenUploadModal] = React.useState<boolean>(false);

  const query = useUploadsQuery({ page: 1, limit: 300 });

  return (
    <>
      <Snackbar
        type="danger"
        msg="Failed to load CV list."
        show={query.isError}
      />
      <BasePage
        isLoading={query.isLoading}
        isError={query.isError}
        showEmpty={!query.data?.length}
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
            {query.data?.map((upload) => (
              <UploadedItem key={upload._id} item={upload} />
            ))}
          </Sheet>

          {query.hasNextPage && (
            <Stack direction="row" justifyContent="center" padding={2}>
              <Button
                variant="solid"
                onClick={() => query.fetchNextPage()}
                disabled={query.isFetchingNextPage}
              >
                {query.isFetchingNextPage ? (
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
