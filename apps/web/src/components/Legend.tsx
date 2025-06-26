import { Box } from "@mui/joy";
import Stack from "@mui/joy/Stack";
import { Tooltip } from "@/components/Tooltip.tsx";
import { Small } from "@/components/typography.tsx";

export type LegendProps = {
  title: string;
  items: {
    label: string;
    color: string;
    tooltipText?: string;
  }[];
};

export const Legend = ({ items }: LegendProps) => {
  return (
    <Stack direction="row" gap={4}>
      {items.map((item) => (
        <Box
          key={item.label}
          sx={{ display: "flex", alignItems: "center", gap: 2 }}
        >
          <Box
            sx={{
              width: 16,
              height: 16,
              backgroundColor: item.color, // Red
              borderRadius: "50%",
            }}
          />
          <Small>{item.label}</Small>
          {item.tooltipText && <Tooltip title={item.tooltipText} />}
        </Box>
      ))}
    </Stack>
  );
};
