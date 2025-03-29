import Box from "@mui/joy/Box";
import DocumentIcon from '@mui/icons-material/Grading';
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { format } from "date-fns";
import { ParsedStatus, UploadItem } from "@kyd/common/api";
import { CircularProgress } from "@mui/joy";
import * as React from "react";
import { Done, ReportProblem } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

const StatusIcon: Record<ParsedStatus, React.ReactNode> = {
    'pending': <CircularProgress variant="solid" size="sm"/>,
    'failed': <ReportProblem color="warning"/>,
    'processed': <Done color="success"/>,
};

export const UploadedItem = ({item}: { item: UploadItem }) => {
    const navigate = useNavigate();
    const hasDetails = item.parseStatus === 'processed';

    const style = {
        backgroundColor: 'var(--joy-palette-background-body)',
        p: 2,
    };

    const hoverStyle = {
        "&:hover": {
            backgroundColor: "var(--joy-palette-primary-softHoverBg)", // Hover color
            cursor: "pointer",
        }
    };

    return (
        <Box key={item._id} onClick={
            hasDetails ? () => navigate(`/uploads/${item._id}`) : undefined
        }
             sx={
                 hasDetails ? {...style, ...hoverStyle} : {...style}
             }>
            <Stack direction="row" gap={2} alignItems="center">
                <Typography level="body-md"><DocumentIcon/></Typography>
                <Stack>

                    <Typography>{item.name} {item.role && ` - ${item.role}`}</Typography>
                    <Typography level="body-xs">Uploaded
                        on {format(new Date(item.createdAt), "MMMM d, yyyy")}</Typography>
                </Stack>
                <Typography sx={{marginLeft: "auto"}} level="body-md">{StatusIcon[item.parseStatus]}</Typography>
            </Stack>
        </Box>
    )
}