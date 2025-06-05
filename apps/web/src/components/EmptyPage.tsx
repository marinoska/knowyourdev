import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";

const EmptyPage = ({ isError = false }: { isError?: boolean }) => {
  return (
    <Stack
      sx={{
        height: "50vh", // Full height of the screen
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 2,
      }}
    >
      {/* Centered Emoji or Illustration */}
      <Box
        sx={{
          fontSize: "4rem",
          marginBottom: 2,
          color: "neutral.outlinedBorder", // Soft neutral color
        }}
      >
        {isError ? "😕" : "🌈 ✨"}
      </Box>

      {/* Message */}
      <Typography level="h4" fontWeight="bold" sx={{ mb: 1 }}>
        {isError ? "Oops..." : "Nothing to show yet"}
      </Typography>
      <Typography level="body-md" sx={{ mb: 2 }}>
        {isError
          ? "Something went wrong, try again later..."
          : "There’s nothing to see here... yet. Try add some content."}
      </Typography>
    </Stack>
  );
};

export default EmptyPage;
