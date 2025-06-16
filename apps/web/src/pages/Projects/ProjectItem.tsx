import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { TProjectsItem } from "@kyd/common/api";
import { BasePage } from "@/components/BasePage";

export const ProjectItem = ({ item }: { item: TProjectsItem }) => {
  const navigate = useNavigate();

  const { name, createdAt, _id } = item;
  return (
    <BasePage.ListItem id={_id} onClick={() => navigate(`/projects/${_id}`)}>
      <Typography level="body-md">
        <BusinessCenterIcon />
      </Typography>
      <Stack>
        <Typography>{name}</Typography>
        <Typography level="body-xs">
          Created on {format(new Date(createdAt), "MMMM d, yyyy")}
        </Typography>
      </Stack>
    </BasePage.ListItem>
  );
};
