import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import { ProjectsItem } from "@kyd/common/api";

export const CandidatesContent = ({ profile }: { profile: ProjectsItem }) => {
  console.log({ profile });
  return (
    <Sheet
      sx={{
        padding: 3,
        gap: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack gap={2}>
        <Typography>No candidates available for this project yet.</Typography>
      </Stack>
    </Sheet>
  );
};

export default CandidatesContent;
