import Typography from "@mui/joy/Typography";

export const Subtitle = ({ text }: { text: string }) => {
  return (
    <Typography textColor="text.secondary" level="title-md">
      {text}
    </Typography>
  );
};
