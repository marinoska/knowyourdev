import { ColorPaletteProp } from "@mui/joy/styles";

export const getScoreColor = (score: number): ColorPaletteProp => {
  if (score >= 85) return "success";
  if (score >= 65) return "primary";
  if (score >= 45) return "warning";
  if (score >= 25) return "neutral";
  return "danger";
};