import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Typography from "@mui/joy/Typography";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const NavigateBackLink = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Box
      onMouseEnter={() => setIsHovered(true)} // Set hover state on mouse enter
      onMouseLeave={() => setIsHovered(false)}
    >
      <IconButton
        onClick={() => navigate(-1)} // Navigate back to the previous page
        aria-label="Back to Dashboard"
        variant="plain"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1, // Space between the icon and text
          color: "text.primary",
          "&:hover": {
            color: "#3F51B5", // Hover color
            transform: "none",
          },
          transition: "color 0.3s ease, transform 0.3s ease", // Smooth transition for hover
        }}
      >
        <ArrowBackIcon
          sx={{
            fontSize: "20px", // Size of the arrow icon
            transition: "transform 0.3s ease", // Smooth hover movement
            ...(isHovered && { transform: "translateX(-4px)" }),
          }}
        />
        <Typography
          level="body-md"
          sx={{
            fontWeight: "medium",
            "&:hover": { color: "inherit" },
          }}
        >
          Back
        </Typography>
      </IconButton>
    </Box>
  );
};
