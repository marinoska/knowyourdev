import CenteredLoader from "@/components/Loader.tsx";
import EmptyPage from "@/components/EmptyPage.tsx";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import { Children, isValidElement, ReactNode } from "react";
import { NavigateBackLink } from "@/components/NavigateBackButton.tsx";
import Box from "@mui/joy/Box";
import Container from "@/components/Container.tsx";

export const BasePage = ({
  children,
  isError = false,
  isLoading = false,
  showEmpty = false,
}: {
  children: ReactNode;
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
      } else if (child.type === BasePage.Content) {
        content.push(child);
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
        gap: 2,
        maxHeight: "100vh",
        overflow: "hidden",
        minWidth: "auto",
        borderRadius: "sm",
        pt: 1,
      }}
    >
      {header}
      <Container>
        {showEmpty ? <EmptyPage isError={isError} /> : content}
      </Container>
    </Stack>
  );
};

BasePage.Header = ({
  children,
  title,
  subtitle,
  caption,
  showBackButton,
}: {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  caption?: string;
  showBackButton?: boolean;
}) => {
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
      <Stack
        direction="row"
        gap={1}
        alignItems="center"
        ml={showBackButton ? -1 : 0}
      >
        {showBackButton && <NavigateBackLink />}
        <Stack>
          {caption && (
            <Typography level="title-sm" textColor="text.tertiary">
              {caption}
            </Typography>
          )}

          <Typography textColor="text.secondary" level="h3">
            {title}
          </Typography>
          {subtitle && <Typography level="title-md">{subtitle}</Typography>}
        </Stack>
      </Stack>
      {children}
    </Stack>
  );
};

BasePage.Content = ({
  children,
  flex = 1,
}: {
  children: ReactNode;
  flex?: number;
}) => {
  return (
    <Box mt={1} flex={flex}>
      {children}
    </Box>
  );
};

BasePage.Sheet = ({ children }: { children: ReactNode }) => {
  return (
    <Sheet
      sx={{
        padding: 2,
      }}
    >
      {children}
    </Sheet>
  );
};

BasePage.ListItem = ({
  children,
  isActive = true,
  onClick,
  id,
}: {
  children: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  id?: string;
}) => {
  const style = {
    backgroundColor: "var(--joy-palette-background-body)",
    p: 2,
  };

  const hoverStyle = {
    "&:hover": {
      backgroundColor: "var(--joy-palette-primary-softHoverBg)",
      cursor: "pointer",
    },
  };

  return (
    <Sheet
      key={id}
      onClick={isActive ? onClick : undefined}
      sx={isActive ? { ...style, ...hoverStyle } : { ...style }}
    >
      <Stack direction="row" gap={2} alignItems="center">
        {children}
      </Stack>
    </Sheet>
  );
};
