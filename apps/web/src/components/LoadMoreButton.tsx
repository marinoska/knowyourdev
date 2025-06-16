import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import { CircularProgress } from "@mui/joy";
import * as React from "react";

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  hasNextPage?: boolean;
}

export const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  onClick,
  isLoading,
  hasNextPage = true,
}) => {
  if (!hasNextPage) return null;

  return (
    <Stack direction="row" justifyContent="center" padding={2}>
      <Button
        variant="solid"
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <CircularProgress size="sm" sx={{ marginRight: 1 }} />
            Loading...
          </>
        ) : (
          "Load More"
        )}
      </Button>
    </Stack>
  );
};
