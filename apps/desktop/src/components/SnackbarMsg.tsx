import Button from "@mui/joy/Button";
import { Snackbar } from "@mui/joy";

export function SnackbarMsg({msg, onClose, variant = 'soft'}: {
    msg: string,
    onClose: VoidFunction,
    variant?: 'soft' | 'solid' | 'outlined'
}) {
    return <Snackbar
        variant="soft"
        color="warning"
        open={!!msg}
        onClose={onClose}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        endDecorator={
            <Button
                onClick={onClose}
                size="md"
                variant={variant}
            >
                Dismiss
            </Button>
        }
    >
        Your message was sent successfully.
    </Snackbar>;
}