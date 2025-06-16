import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { ProjectsItem } from "@kyd/common/api";
import { BasePage } from "@/components/BasePage.tsx";

export const CandidatesContent = ({ profile }: { profile: ProjectsItem }) => {
  console.log({ profile });
  return (
    <BasePage.Content>
      <Stack gap={2}>
        <Typography>No candidates available for this project yet.</Typography>
      </Stack>
    </BasePage.Content>
  );
};

export default CandidatesContent;
