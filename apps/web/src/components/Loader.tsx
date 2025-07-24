import CircularProgress from "@mui/joy/CircularProgress";
import Box from "@mui/joy/Box";

const CenteredLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        minHeight: "200px", // Ensure a minimum height for the loader
        width: "100%",
      }}
    >
      <CircularProgress size="md" />
    </Box>
  );
};

export default CenteredLoader;
