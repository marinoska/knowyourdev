import Box from "@mui/joy/Box";
import DocumentIcon from '@mui/icons-material/Grading';
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { format } from "date-fns";

export const UploadedItem = ({title, date}: { title: string, date: Date }) => {
    return (
        <Box onClick={() => {
            alert("www")
        }}
             sx={{
                 backgroundColor: 'var(--joy-palette-background-body)',
                 p: 2,
                 "&:hover": {
                     backgroundColor: "var(--joy-palette-primary-softHoverBg)", // Hover color
                     cursor: "pointer",
                 },
             }}>
            <Stack direction="row" gap={2} alignItems="center">
                <Typography level="body-md"><DocumentIcon/></Typography>
                <Stack>

                    <Typography>{title}</Typography>
                    <Typography level="body-xs">Uploaded on {format(date, "MMMM d, yyyy")}</Typography>
                </Stack>
            </Stack>
        </Box>
    )
}