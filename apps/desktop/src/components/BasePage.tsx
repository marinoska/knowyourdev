import * as React from "react";
import CenteredLoader from "@/components/Loader.tsx";
import Sheet from "@mui/joy/Sheet";
import EmptyPage from "@/components/EmptyPage.tsx";
import Box from "@mui/joy/Box";

export const BasePage = ({
                             children,
                             isError = false,
                             isLoading = false,
                             showEmpty = false,
                             component: Component = Sheet,
                             header
                         }:
                             {
                                 children: React.ReactNode,
                                 header: React.ReactNode,
                                 isError: boolean,
                                 isLoading: boolean,
                                 showEmpty: boolean,
                                 component?: React.ElementType,
                             }) => {
    if (isLoading) {
        return <CenteredLoader/>;
    }
    return (
        <Box
            sx={{
                width: 'fit-content',
                minWidth: {
                    xs: 'auto', // No minimum width on small screens
                    md: '900px', // Minimum width of 800px for desktop (from "md" breakpoint)
                },
                // maxWidth: "1000px",
                borderRadius: "sm",
            }}>
            {header}
            <Component
                sx={{
                    p: 3,
                }}
            >
                {showEmpty ? <EmptyPage isError={isError}/> : children}
            </Component>
        </Box>
    )
}