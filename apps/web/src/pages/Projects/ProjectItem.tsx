import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import Stack from "@mui/joy/Stack";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { TProjectsItem } from "@kyd/common/api";
import { BasePage } from "@/components/BasePage";
import { Regular, Smallest } from "@/components/typography.tsx";

export const ProjectItem = ({ item }: { item: TProjectsItem }) => {
  const navigate = useNavigate();

  const { name, createdAt, _id } = item;
  return (
    <BasePage.ListItem id={_id} onClick={() => navigate(`/projects/${_id}`)}>
      <Regular>
        <BusinessCenterIcon />
      </Regular>
      <Stack>
        <Regular>{name}</Regular>
        <Smallest>
          Created on {format(new Date(createdAt), "MMMM d, yyyy")}
        </Smallest>
      </Stack>
    </BasePage.ListItem>
  );
};
