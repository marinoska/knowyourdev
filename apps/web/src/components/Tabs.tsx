import { useState, ReactNode, useMemo } from "react";
import Box from "@mui/joy/Box";
import JoyTabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import { Container } from "@/components/Container.tsx";

export type TabItem = {
  label: string;
  content: ReactNode;
};

export const Tabs = ({
  tabs,
  initialTab = 0,
  onTabChange,
}: {
  tabs: TabItem[];
  initialTab?: number;
  onTabChange?: (index: number) => void;
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = useMemo(
    () => (newValue: number) => {
      setActiveTab(newValue);
      if (onTabChange) {
        onTabChange(newValue);
      }
    },
    [onTabChange, setActiveTab],
  );

  return (
    <Box id="analysis-tabs" sx={{ mb: 8 }}>
      <JoyTabs
        variant="plain"
        value={activeTab}
        // @ts-ignore
        onChange={(_, newValue) => handleTabChange(newValue)}
        sx={{
          borderBottom: "1px solid",
          borderColor: "neutral.outlinedBorder",
          background: "transparent",
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
                background: "transparent",
                "&[aria-selected='true']": {
                  background: "transparent",
                },
                color: activeTab === index ? "solidBg" : "text.secondary",
                "&:hover": { color: "secondary.solidHoverBg" },
                borderBottom:
                  activeTab === index
                    ? "2px solid var(--joy-palette-secondary-solidBg)"
                    : "none",
              }}
            >
              {tab.label}
            </Tab>
          ))}
        </TabList>
        <Container>
          {tabs.map((tab, index) => (
            <TabPanel
              key={index}
              value={index}
              sx={{
                // p: 0,
                background: "var(--joy-palette-background-surface)",
              }}
            >
              {tab.content}
            </TabPanel>
          ))}
        </Container>
      </JoyTabs>
    </Box>
  );
};

export default Tabs;
