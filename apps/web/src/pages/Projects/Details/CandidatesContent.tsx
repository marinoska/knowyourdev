import Stack from "@mui/joy/Stack";
import { TUploadItem } from "@kyd/common/api";
import { LoadMoreButton } from "@/components/LoadMoreButton.tsx";
import { useUploadsQuery } from "@/api/query/useUploadsQuery.ts";
import CenteredLoader from "@/components/Loader.tsx";
import EmptyPage from "@/components/EmptyPage.tsx";
import { useNavigate } from "react-router-dom";
import { ReactNode, useCallback } from "react";
import { BasePage } from "@/components/BasePage.tsx";
import Typography from "@mui/joy/Typography";
import DocumentIcon from "@mui/icons-material/Grading";
import { format } from "date-fns";
import { Done, ReportProblem } from "@mui/icons-material";
import { CircularProgress } from "@mui/joy";
import { Regular, Smallest } from "@/components/typography.tsx";
import { TProject } from "@/api/query/types.ts";

const StatusIcon: Record<string, ReactNode> = {
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
      <Regular>
        <DocumentIcon />
      </Regular>
      <Stack>
        <Regular>
          {fullName ? fullName : name} {position && ` - ${position}`}
        </Regular>
        <Smallest>
          Uploaded on {format(new Date(createdAt), "MMMM d, yyyy")}{" "}
          {role && ` for ${role}`} ({name})
        </Smallest>
      </Stack>
      <Typography sx={{ marginLeft: "auto" }}>
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
    </Stack>
  );
};

export const CandidatesContent = ({ project }: { project: TProject }) => {
  return <CandidatesList projectId={project._id} />;
};

export default CandidatesContent;
