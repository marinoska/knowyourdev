import Button from "@mui/joy/Button";
import { Snackbar } from "@mui/joy";

export function SnackbarWarning({msg, onClose, variant = 'soft', type = 'warning'}: {
    msg: string,
    onClose: VoidFunction,
    variant?: 'soft' | 'solid' | 'outlined',
    type?: 'danger'
        | 'neutral'
        | 'primary'
        | 'success'
        | 'warning'
}) {
    return <Snackbar
        variant="soft"
        color={type}
        open={!!msg}
        autoHideDuration={5000}
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
        {msg}
    </Snackbar>;
}