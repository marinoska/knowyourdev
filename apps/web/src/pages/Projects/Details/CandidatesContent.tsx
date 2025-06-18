import Stack from "@mui/joy/Stack";
import { TProjectsItem } from "@kyd/common/api";
import Container from "@/components/Container.tsx";
import { UploadItem } from "@/pages/Resume/UploadItem.tsx";
import { LoadMoreButton } from "@/components/LoadMoreButton.tsx";
import { useUploadsQuery } from "@/api/query/useUploadsQuery.ts";
import Loader from "@/components/Loader.tsx";
import Button from "@mui/joy/Button";
import UploadIcon from "@mui/icons-material/Upload";
import Box from "@mui/joy/Box";

export const CandidatesList = ({ projectId }: { projectId: string }) => {
  // const [openUploadModal, setOpenUploadModal] = React.useState<boolean>(false);

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
      <Stack
        direction="row"
        justifyContent="flex-end"
        gap={2}
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Button onClick={null} startDecorator={<UploadIcon />} size="md">
          Upload CV
        </Button>
      </Stack>
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
