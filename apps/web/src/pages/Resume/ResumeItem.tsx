import DocumentIcon from "@mui/icons-material/Grading";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { format } from "date-fns";
import { ParsedStatus, TUpload } from "@kyd/common/api";
import { CircularProgress } from "@mui/joy";
import * as React from "react";
import { Done, ReportProblem } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { BasePage } from "@/components/BasePage";
import { Regular, Smallest } from "@/components/typography.tsx";

const StatusIcon: Record<ParsedStatus, React.ReactNode> = {
  pending: <CircularProgress variant="solid" size="sm" />,
  failed: <ReportProblem color="warning" />,
  processed: <Done color="success" />,
};

export const ResumeItem = ({ item }: { item: TUpload }) => {
  const { name, fullName, position, createdAt, parseStatus, _id } = item;
  const navigate = useNavigate();
  const isActive = item.parseStatus === "processed";
  const onClick = useCallback(() => {
    if (isActive) {
      navigate(`/uploads/${_id}`);
    }
  }, [_id, isActive, navigate]);

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
        </Smallest>
      </Stack>
      <Typography sx={{ marginLeft: "auto" }}>
        {StatusIcon[parseStatus]}
      </Typography>
    </BasePage.ListItem>
  );
};
