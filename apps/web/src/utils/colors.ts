import { ColorPaletteProp } from "@mui/joy/styles";

export const SCORE_DISTRIBUTION = {
  EXCELLENT: 85,
  GOOD: 70,
  FAIR: 50,
  POOR: 25,
} as const;

export const getScoreColor = (score: number): ColorPaletteProp => {
  let color: ColorPaletteProp;
  switch (true) {
    case score >= SCORE_DISTRIBUTION.EXCELLENT:
      color = "success";
      break;
    case score >= SCORE_DISTRIBUTION.GOOD:
      color = "primary";
      break;
    case score >= SCORE_DISTRIBUTION.FAIR:
      color = "warning";
      break;
    case score >= SCORE_DISTRIBUTION.POOR:
      color = "neutral";
      break;
    default:
      color = "danger";
  }

  return color;
};
