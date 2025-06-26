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
    <Typography textColor="text.secondary" component="h5">
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
}: {
  children: ReactNode;
  color?: ColorPaletteProp;
}) => {
  return (
    <Typography level="body-sm" color={color}>
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
