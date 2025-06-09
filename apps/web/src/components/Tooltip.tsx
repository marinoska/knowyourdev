import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { Tooltip as JoyTooltip } from "@mui/joy";

export const Tooltip = ({title}: { title: string }) => {
    return (
        <JoyTooltip sx={{maxWidth: 350}} title={title}>
            <InfoOutlined
                sx={{
                    marginLeft: 0,
                    fontSize: 18,
                    cursor: "pointer",
                    color: "action.active",
                }}
            />
        </JoyTooltip>
    );
};
