import Button from "@mui/joy/Button";
import { Snackbar as JoySnackbar } from "@mui/joy";

export function Snackbar({msg, onClose, variant = 'soft', type = 'warning'}: {
    msg: string,
    onClose?: VoidFunction,
    variant?: 'soft' | 'solid' | 'outlined',
    type?: 'danger'
        | 'neutral'
        | 'primary'
        | 'success'
        | 'warning'
}) {
    return <JoySnackbar
        variant="soft"
        color={type}
        open={!!msg}
        autoHideDuration={5000}
        onClose={onClose}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        endDecorator={
            <Button
                onClick={onClose || (() => {
                })}
                size="md"
                variant={variant}
            >
                Dismiss
            </Button>
        }
    >
        {msg}
    </JoySnackbar>;
}