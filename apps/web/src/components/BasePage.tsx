import CenteredLoader from "@/components/Loader.tsx";
import EmptyPage from "@/components/EmptyPage.tsx";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import { Children, ElementType, isValidElement, ReactNode } from "react";

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
  let header: ReactNode = null;
  const content: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      if (child.type === BasePage.Header) {
        header = child;
      } else {
        content.push(child);
      }
    }
  });

  if (isLoading) {
    return <CenteredLoader />;
  }

  return (
    <Stack
      sx={{
        maxHeight: "100vh",
        overflow: "hidden",
        minWidth: "auto",
        borderRadius: "sm",
        pl: 2,
        pt: 2,
        gap: 2,
      }}
    >
      {header}
      {showEmpty ? <EmptyPage isError={isError} /> : content}
    </Stack>
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
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  icon?: ElementType;
  action?: VoidFunction;
}) => {
  if (children) {
    return <>{children}</>;
  }

  return (
    <Stack
      sx={{
        display: "flex",
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
