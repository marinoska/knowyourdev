import { Stack, Typography } from "@mui/joy";
import { Tooltip } from "@/components/Tooltip.tsx";
import { ReactNode } from "react";

export const ChartContainer = (
    {title, tooltip, children}: { children: ReactNode, title: string, tooltip?: string }
) => {
    return <Stack
        gap={3}
        sx={{
            backgroundColor: "#fff",
        }}
    >
        <Stack gap={1} direction="row" sx={{alignItems: "center"}}>
            <Typography level="h4">{title}</Typography>
            {tooltip && <Tooltip title={tooltip}/>}
        </Stack>
        {children}
    </Stack>
}