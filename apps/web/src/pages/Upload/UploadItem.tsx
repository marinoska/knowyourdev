import DocumentIcon from "@mui/icons-material/Grading";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { format } from "date-fns";
import { ParsedStatus, TUploadItem } from "@kyd/common/api";
import { CircularProgress } from "@mui/joy";
import * as React from "react";
import { Done, ReportProblem } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { BasePage } from "@/components/BasePage";

const StatusIcon: Record<ParsedStatus, React.ReactNode> = {
  pending: <CircularProgress variant="solid" size="sm" />,
  failed: <ReportProblem color="warning" />,
  processed: <Done color="success" />,
};

export const UploadItem = ({ item }: { item: TUploadItem }) => {
  const { role, name, fullName, position, createdAt, parseStatus, _id } = item;
  const navigate = useNavigate();
  const isActive = item.parseStatus === "processed";
  const onClick = useCallback(() => {
    if (isActive) {
      navigate(`/uploads/${_id}`);
    }
  }, [_id, isActive, navigate]);

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
