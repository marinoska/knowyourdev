import CircularProgress from "@mui/joy/CircularProgress";
import Box from "@mui/joy/Box";

const CenteredLoader = () => {
  return (
    <Box
      sx={{
        position: "absolute", // Makes it absolute in the parent container.
        top: "30%", // Shifts to the vertical center.
        left: "50%", // Shifts to the horizontal center.
        transform: "translate(-50%, -50%)", // Centers it perfectly.
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress size="md" />
    </Box>
  );
};

export default CenteredLoader;
