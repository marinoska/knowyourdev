import { useState, ReactNode } from "react";
import Box from "@mui/joy/Box";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";

export type TabItem = {
    label: string;
    content: ReactNode;
};

export const AnalysisTabs = ({tabs}: { tabs: TabItem[] }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <Box id="analysis-tabs" sx={{mb: 8}}>
            <Tabs
                variant="plain"
                value={activeTab}
                // @ts-ignore
                onChange={(_, newValue) => setActiveTab(newValue)}
                sx={{
                    borderBottom: "1px solid",
                    borderColor: "neutral.outlinedBorder",
                    background: "transparent"
                }}
            >
                <TabList
                    variant="plain"
                    sx={{
                        background: "transparent",
                        display: "flex",
                        gap: 2,
                    }}
                >

                    {tabs.map((tab, index) => (
                        <Tab
                            variant="plain"
                            key={index}
                            value={index}
                            sx={{
                                px: 4,
                                py: 2,
                                fontWeight: "md",
                                cursor: "pointer",
                                // "--Tab-background": "transparent", // Resets default Joy background styles
                                // "--Tab-hoverBackground": "transparent", // Prevent hover styles
                                // "--Tab-selectedBackground": "transparent", // Prevent active background
                                background: "transparent",
                                "&[aria-selected='true']": {
                                    background: "transparent",
                                },
                                color: activeTab === index ? "solidBg" : "text.secondary",
                                "&:hover": {color: "secondary.solidHoverBg"},
                                borderBottom: activeTab === index ? "2px solid var(--joy-palette-secondary-solidBg)" : "none",
                            }}
                        >
                            {tab.label}
                        </Tab>
                    ))}


                </TabList>
                {tabs.map((tab, index) => (
                    <TabPanel
                        key={index}
                        value={index}
                        sx={{
                            py: 2,
                            background: 'var(--joy-palette-background-surface)'
                        }}
                    >
                        {tab.content}
                    </TabPanel>
                ))}
            </Tabs>
        </Box>
    );
};

export default AnalysisTabs;