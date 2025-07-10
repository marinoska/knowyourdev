import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import Stack from "@mui/joy/Stack";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { BasePage } from "@/components/BasePage";
import { Regular, Smallest } from "@/components/typography.tsx";
import { TProjectDTO } from "@/api/query/types.ts";
import Chip from "@mui/joy/Chip";
import { SCOPE_NAMES } from "@kyd/common/api";

export const ProjectItem = ({ item }: { item: TProjectDTO }) => {
  const navigate = useNavigate();

  const { name, createdAt, _id } = item;
  return (
    <BasePage.ListItem id={_id} onClick={() => navigate(`/projects/${_id}`)}>
      <Regular>
        <BusinessCenterIcon />
      </Regular>
      <Stack>
        <Stack direction="row" gap={2} flexWrap="wrap" alignItems="center">
          <Regular>{name}</Regular>
          <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
            {item.settings.techFocus.map((scope) => (
              <Chip size="md" variant="outlined" color="primary">
                {SCOPE_NAMES[scope]}
              </Chip>
            ))}
          </Stack>
        </Stack>
        <Smallest>
          Created on {format(new Date(createdAt), "MMMM d, yyyy")}
        </Smallest>
      </Stack>
    </BasePage.ListItem>
  );
};
