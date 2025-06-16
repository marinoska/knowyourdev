import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { TProjectsItem } from "@kyd/common/api";

export const CandidatesContent = ({ profile }: { profile: TProjectsItem }) => {
  console.log({ profile });
  return (
    <Stack gap={2}>
      <Typography>No candidates available for this project yet.</Typography>
    </Stack>
  );
};

export default CandidatesContent;
