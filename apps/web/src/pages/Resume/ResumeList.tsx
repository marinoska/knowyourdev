import { ResumeItem } from "./ResumeItem.tsx";
import { useUploadsQuery } from "@/api/query/useUploadsQuery.ts";
import { Snackbar } from "@/components/Snackbar.tsx";
import { BasePage } from "@/components/BasePage.tsx";
import { LoadMoreButton } from "@/components/LoadMoreButton.tsx";
import { UploadButton } from "@/components/UploadButton.tsx";
import Stack from "@mui/joy/Stack";

export const ResumeList = () => {
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
        <BasePage.Header title="Uploaded CVs">
          <UploadButton />
        </BasePage.Header>
        <BasePage.Content>
          <BasePage.Sheet>
            <Stack gap={2} direction="column">
              {query.data?.map((upload) => (
                <ResumeItem key={upload._id} item={upload} />
              ))}
            </Stack>
          </BasePage.Sheet>

          <LoadMoreButton
            onClick={() => query.fetchNextPage()}
            isLoading={query.isFetchingNextPage}
            hasNextPage={query.hasNextPage}
          />
        </BasePage.Content>
      </BasePage>
    </>
  );
};
