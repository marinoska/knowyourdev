import * as React from "react";
import CenteredLoader from "@/components/Loader.tsx";
import EmptyPage from "@/components/EmptyPage.tsx";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";

export const BasePage = ({
  children,
  isError = false,
  isLoading = false,
  showEmpty = false,
}: {
  children: React.ReactNode;
  isError: boolean;
  isLoading: boolean;
  showEmpty: boolean;
}) => {
  // Extract header and content from children
  let header: React.ReactNode = null;
  const content: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === BasePage.Header) {
      header = child;
    } else {
      content.push(child);
    }
  });

  if (isLoading) {
    return <CenteredLoader />;
  }
  return (
    <Box
      sx={{
        maxHeight: "100vh", // Restrict height to viewport
        overflow: "auto", // Enable scrolling when content overflows
        minWidth: "auto", // Allow component to shrink with no fixed minimal width
        borderRadius: "sm",
        pl: 2,
      }}
    >
      {header}
      {showEmpty ? <EmptyPage isError={isError} /> : content}
    </Box>
  );
};

// Header component to be used as a child of BasePage
BasePage.Header = ({
  children,
  title,
  subtitle,
  buttonLabel,
  icon: Icon,
  action,
}: {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  icon?: React.ElementType;
  action?: VoidFunction;
}) => {
  if (children) {
    return <>{children}</>;
  }

  return (
    <Stack
      sx={{
        display: "flex",
        pt: 1,
        pb: 3,
        gap: 3,
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "start", sm: "center" },
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      <Stack>
        <Typography textColor="text.secondary" level="h3">
          {title}
        </Typography>
        {subtitle && <Typography level="title-md">{subtitle}</Typography>}
      </Stack>
      {buttonLabel && (
        <Button onClick={action} startDecorator={Icon && <Icon />} size="md">
          {buttonLabel}
        </Button>
      )}
    </Stack>
  );
};
