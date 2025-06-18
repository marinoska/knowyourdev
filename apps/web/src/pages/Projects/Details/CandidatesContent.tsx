import Stack from "@mui/joy/Stack";
import { TProjectsItem } from "@kyd/common/api";
import Container from "@/components/Container.tsx";
import { UploadItem } from "@/pages/Resume/UploadItem.tsx";
import { LoadMoreButton } from "@/components/LoadMoreButton.tsx";
import { useUploadsQuery } from "@/api/query/useUploadsQuery.ts";
import Loader from "@/components/Loader.tsx";

export const CandidatesList = ({ projectId }: { projectId: string }) => {
  const query = useUploadsQuery({ page: 1, limit: 300, projectId });

  if (query.isLoading) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }
  return (
    <Stack gap={1} direction="column">
      {/* put filters here*/}
      <Container>
        <Stack gap={2}>
          {query.data?.map((upload) => (
            <UploadItem key={upload._id} item={upload} />
          ))}
        </Stack>

        <LoadMoreButton
          onClick={() => query.fetchNextPage()}
          isLoading={query.isFetchingNextPage}
          hasNextPage={query.hasNextPage}
        />
      </Container>
    </Stack>
  );
};

export const CandidatesContent = ({ project }: { project: TProjectsItem }) => {
  return <CandidatesList projectId={project._id} />;
};

export default CandidatesContent;
