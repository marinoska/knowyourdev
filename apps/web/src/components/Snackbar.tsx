import Button from "@mui/joy/Button";
import { Snackbar as JoySnackbar } from "@mui/joy";
import { useCallback, useState } from "react";

export function Snackbar({
  msg,
  onClose,
  show = false,
  variant = "soft",
  type = "warning",
}: {
  msg: string;
  onClose?: VoidFunction;
  show?: boolean;
  variant?: "soft" | "solid" | "outlined";
  type?: "danger" | "neutral" | "primary" | "success" | "warning";
}) {
  const [open, setOpen] = useState(show);

  const handleClose = useCallback(() => {
    setOpen(false);
    onClose && onClose();
  }, [onClose]);

  return (
    <JoySnackbar
      variant="soft"
      color={type}
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      endDecorator={
        <Button onClick={handleClose} size="md" variant={variant}>
          Dismiss
        </Button>
      }
    >
      {msg}
    </JoySnackbar>
  );
}
