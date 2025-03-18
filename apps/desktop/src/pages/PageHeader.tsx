import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import React from "react";
import Stack from "@mui/joy/Stack";

export const PageHeader = ({title, subtitle, buttonLabel, icon: Icon, action}: {
    title: string,
    subtitle?: string,
    buttonLabel?: string,
    icon?: React.ElementType,
    action?: VoidFunction,
}) => {
    return (
        <Stack
            sx={{
                display: 'flex',
                p: 3,
                gap: 3,
                flexDirection: {xs: 'column', sm: 'row'},
                alignItems: {xs: 'start', sm: 'center'},
                flexWrap: 'wrap',
                justifyContent: 'space-between',
            }}
        >
            <Stack>
                <Typography color="secondary" level="h2" component="h1">
                    {title}
                </Typography>
                {subtitle &&
                    <Typography level="title-md" component="h2">
                        {subtitle}
                    </Typography>
                }
            </Stack>
            {buttonLabel && <Button
                onClick={action}
                startDecorator={Icon && <Icon/>}
                size="md"
            >
                {buttonLabel}
            </Button>}
        </Stack>
    )
}
