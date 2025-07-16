import { ColorPaletteProp } from "@mui/joy/styles";
import Stack from "@mui/joy/Stack";
import { Small } from "@/components/typography.tsx";

export const MatchDetailsRow = ({
  value,
  color,
  text,
}: {
  value: string;
  color: ColorPaletteProp;
  text: string;
}) => {
  return (
    <Stack
      direction="row"
      gap={1}
      alignItems="center"
      justifyContent="space-between"
    >
      <Small sx={{ textTransform: 'capitalize' }}>{text}</Small>
      <Small color={color}>{value}</Small>
    </Stack>
  );
};
