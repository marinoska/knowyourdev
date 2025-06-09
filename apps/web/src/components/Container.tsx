import * as React from "react";
import { useEffect, useRef, useState } from "react";
import Box from "@mui/joy/Box";

export const Container = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [calculatedOffset, setCalculatedOffset] = useState<number>(100);

  useEffect(() => {
    if (containerRef.current) {
      const calculateOffset = () => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const topOffset = rect.top;
          // Add a small buffer (e.g., 20px) to ensure content isn't cut off
          setCalculatedOffset(topOffset + 20);
        }
      };

      calculateOffset();

      window.addEventListener("resize", calculateOffset);
      return () => window.removeEventListener("resize", calculateOffset);
    }
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        height: `calc(100vh - ${calculatedOffset}px)`,
        overflow: "auto",
      }}
    >
      {children}
    </Box>
  );
};

export default Container;