import * as React from "react";
import CenteredLoader from "@/components/Loader.tsx";
import Sheet from "@mui/joy/Sheet";
import EmptyPage from "@/components/EmptyPage.tsx";
import Box from "@mui/joy/Box";

export const BasePage = ({
  children,
  isError = false,
  isLoading = false,
  showEmpty = false,
  component: Component = Sheet,
  header,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  isError: boolean;
  isLoading: boolean;
  showEmpty: boolean;
  component?: React.ElementType;
}) => {
  if (isLoading) {
    return <CenteredLoader />;
  }
  return (
    <Box
      sx={{
        maxHeight: "100vh", // Restrict height to viewport
        overflow: "hidden", // Enable scrolling when content overflows
        minWidth: {
          xs: "auto", // No minimum width on small screens
          md: "900px", // Minimum width of 800px for desktop (from "md" breakpoint)
        },
        borderRadius: "sm",
      }}
    >
      {header}
      <Box sx={{ height: "calc(100vh - 100px)", overflow: "auto", padding: 2 }}>
        <Component sx={{ p: 3 }}>
          {showEmpty ? <EmptyPage isError={isError} /> : children}
        </Component>
      </Box>
    </Box>
  );
};
