import Typography from "@mui/joy/Typography";
import { ColorPaletteProp } from "@mui/joy/styles";
import { ReactNode } from "react";

export const Title = ({
  children,
  text,
}: {
  children?: ReactNode;
  text?: string;
}) => {
  return (
    <Typography
      textColor="text.secondary"
      component="h5"
      textTransform="capitalize"
    >
      {children || text}
    </Typography>
  );
};
export const Subtitle = ({
  children,
  color,
}: {
  children: ReactNode;
  color?: ColorPaletteProp;
}) => {
  return (
    <Typography level="title-sm" fontWeight="lg" color={color}>
      {children}
    </Typography>
  );
};
export const Small = ({
  children,
  color,
  sx,
}: {
  children: ReactNode;
  color?: ColorPaletteProp;
  sx?: unknown;
}) => {
  return (
    <Typography level="body-sm" color={color} sx={sx}>
      {children}
    </Typography>
  );
};
export const Smallest = ({
  children,
  color,
}: {
  children: ReactNode;
  color?: ColorPaletteProp;
}) => {
  return (
    <Typography level="body-xs" color={color}>
      {children}
    </Typography>
  );
};

export const Regular = ({
  children,
  color,
}: {
  children: ReactNode;
  color?: ColorPaletteProp;
}) => {
  return (
    <Typography level="body-md" color={color}>
      {children}
    </Typography>
  );
};
