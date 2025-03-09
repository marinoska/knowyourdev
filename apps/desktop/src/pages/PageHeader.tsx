import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import React from "react";
import Divider from "@mui/joy/Divider";

export const PageHeader = ({title, buttonLabel, icon: Icon, action}: {
    title: string,
    buttonLabel?: string,
    icon: React.ElementType,
    action?: VoidFunction,
}) => {
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    m: 3,
                    gap: 3,
                    flexDirection: {xs: 'column', sm: 'row'},
                    alignItems: {xs: 'start', sm: 'center'},
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                }}
            >
                <Typography level="h2" component="h1">
                    {title}
                </Typography>
                {buttonLabel && <Button
                    onClick={action}
                    startDecorator={<Icon/>}
                    size="md"
                >
                    {buttonLabel}
                </Button>}
            </Box>
            <Divider/>

        </>
    )
}
