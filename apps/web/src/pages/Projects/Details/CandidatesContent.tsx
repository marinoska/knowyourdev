import Stack from "@mui/joy/Stack";
import { TProjectsItem, TUploadItem } from "@kyd/common/api";
import Container from "@/components/Container.tsx";
import { LoadMoreButton } from "@/components/LoadMoreButton.tsx";
import { useUploadsQuery } from "@/api/query/useUploadsQuery.ts";
import CenteredLoader from "@/components/Loader.tsx";
import EmptyPage from "@/components/EmptyPage.tsx";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { BasePage } from "@/components/BasePage.tsx";
import Typography from "@mui/joy/Typography";
import DocumentIcon from "@mui/icons-material/Grading";
import { format } from "date-fns";
import { Done, ReportProblem } from "@mui/icons-material";
import { CircularProgress } from "@mui/joy";

const StatusIcon: Record<string, React.ReactNode> = {
  pending: <CircularProgress variant="solid" size="sm" />,
  failed: <ReportProblem color="warning" />,
  processed: <Done color="success" />,
};

const ProjectCandidateItem = ({
  item,
  projectId,
}: {
  item: TUploadItem;
  projectId: string;
}) => {
  const { role, name, fullName, position, createdAt, parseStatus, _id } = item;
  const navigate = useNavigate();
  const isActive = item.parseStatus === "processed";
  const onClick = useCallback(() => {
    if (isActive) {
      navigate(`/projects/${projectId}/candidates/${_id}`);
    }
  }, [_id, isActive, navigate, projectId]);

  return (
    <BasePage.ListItem id={_id} isActive={isActive} onClick={onClick}>
      <Typography level="body-md">
        <DocumentIcon />
      </Typography>
      <Stack>
        <Typography>
          {fullName ? fullName : name} {position && ` - ${position}`}
        </Typography>
        <Typography level="body-xs">
          Uploaded on {format(new Date(createdAt), "MMMM d, yyyy")}{" "}
          {role && ` for ${role}`} ({name})
        </Typography>
      </Stack>
      <Typography sx={{ marginLeft: "auto" }} level="body-md">
        {StatusIcon[parseStatus]}
      </Typography>
    </BasePage.ListItem>
  );
};

export const CandidatesList = ({ projectId }: { projectId: string }) => {
  const query = useUploadsQuery({ page: 1, limit: 300, projectId });

  if (query.isLoading) {
    return <CenteredLoader />;
  }

  if (!query.data?.length || query.isError) {
    return <EmptyPage isError={query.isError} />;
  }

  return (
    <Stack gap={1} direction="column">
      {/* put filters here*/}
      <Container>
        <Stack gap={2}>
          {query.data?.map((upload) => (
            <ProjectCandidateItem
              key={upload._id}
              item={upload}
              projectId={projectId}
            />
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
