import Stack from "@mui/joy/Stack";
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
import { TProjectDTO } from "@/api/query/types.ts";
import Chip from "@mui/joy/Chip";
import { getScoreColor } from "@/utils/colors.ts";
import { TExtendedUpload, TUpload } from "@kyd/common/api";

const StatusIcon: Record<string, ReactNode> = {
  pending: <CircularProgress variant="solid" size="sm" />,
  failed: <ReportProblem color="warning" />,
  processed: <Done color="success" />,
};

const ProjectCandidateItem = ({
  item,
  projectId,
}: {
  item: TUpload | TExtendedUpload;
  projectId: string;
}) => {
  const { name, fullName, position, createdAt, parseStatus, _id } = item;
  let score = undefined;
  if ("match" in item) {
    score = item.match.overallMatch;
  }

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
          Uploaded on {format(new Date(createdAt), "MMMM d, yyyy")} {name}
          {score && (
            <>
              &nbsp;•&nbsp;
              <Chip variant="soft" color={getScoreColor(score)} size="md">
                {score.toFixed(2)}% {score > 0.5 ? "Match" : "No match"}
              </Chip>
            </>
          )}
        </Smallest>
      </Stack>
      <Typography sx={{ marginLeft: "auto" }}>
        {StatusIcon[parseStatus]}
      </Typography>
    </BasePage.ListItem>
  );
};

export const CandidatesList = ({ project }: { project: TProjectDTO }) => {
  const query = useUploadsQuery({
    page: 1,
    limit: 300,
    projectId: project._id,
    withMatch: true,
  });

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
        {query.data?.map((upload: TUpload | TExtendedUpload) => {
          return (
            <ProjectCandidateItem
              key={upload._id}
              item={upload}
              projectId={project._id}
            />
          );
        })}
      </Stack>

      <LoadMoreButton
        onClick={() => query.fetchNextPage()}
        isLoading={query.isFetchingNextPage}
        hasNextPage={query.hasNextPage}
      />
    </Stack>
  );
};

export const CandidatesContent = ({ project }: { project: TProjectDTO }) => {
  return <CandidatesList project={project} />;
};

export default CandidatesContent;
