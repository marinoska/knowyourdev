import { UploadItem } from "./UploadItem.tsx";
import { useUploadsQuery } from "@/api/query/useUploadsQuery.ts";
import { Snackbar } from "@/components/Snackbar.tsx";
import { BasePage } from "@/components/BasePage.tsx";
import Container from "@/components/Container.tsx";
import { LoadMoreButton } from "@/components/LoadMoreButton.tsx";
import { UploadButton } from "@/components/UploadButton.tsx";

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
        <Container>
          <BasePage.Content>
            {query.data?.map((upload) => (
              <UploadItem key={upload._id} item={upload} />
            ))}
          </BasePage.Content>

          <LoadMoreButton
            onClick={() => query.fetchNextPage()}
            isLoading={query.isFetchingNextPage}
            hasNextPage={query.hasNextPage}
          />
        </Container>
      </BasePage>
    </>
  );
};
