import * as React from "react";
import Box from "@mui/joy/Box";

export const ScrollableBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ height: "calc(100vh - 100px)", overflow: "auto" }}>
      {children}
    </Box>
  );
};
