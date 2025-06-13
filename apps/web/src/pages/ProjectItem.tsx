import Box from "@mui/joy/Box";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { format } from "date-fns";
import * as React from "react";
import { useNavigate } from "react-router-dom";

// Define the Project item type
export interface ProjectItem {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

export const ProjectItem = ({ item }: { item: ProjectItem }) => {
  const navigate = useNavigate();

  const style = {
    backgroundColor: "var(--joy-palette-background-body)",
    p: 2,
  };

  const hoverStyle = {
    "&:hover": {
      backgroundColor: "var(--joy-palette-primary-softHoverBg)", // Hover color
      cursor: "pointer",
    },
  };

  const { name, description, createdAt, _id } = item;
  return (
    <Box
      key={_id}
      onClick={() => navigate(`/projects/${_id}`)}
      sx={{ ...style, ...hoverStyle }}
    >
      <Stack direction="row" gap={2} alignItems="center">
        <Typography level="body-md">
          <BusinessCenterIcon />
        </Typography>
        <Stack>
          <Typography>
            {name}
          </Typography>
          <Typography level="body-xs">
            Created on {format(new Date(createdAt), "MMMM d, yyyy")}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};
