import { useState, ReactNode, useMemo, useEffect } from "react";
import Box from "@mui/joy/Box";
import JoyTabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import { Container } from "@/components/Container.tsx";
import { useLocation, useNavigate } from "react-router-dom";

export type TabItem = {
  label: string;
  content: ReactNode;
};

export type TabsRecord = Record<string, TabItem>;

export const Tabs = ({
  tabs,
  initialTab = 0,
  onTabChange,
}: {
  tabs: TabsRecord;
  initialTab?: number;
  onTabChange?: (index: number) => void;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const hashes = Object.keys(tabs);
  const hash = location.hash.replace("#", "");
  const index = hashes.indexOf(hash);

  // Initialize active tab based on URL hash if available
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update active tab when hash changes
  useEffect(() => {
    if (hash && index >= 0) {
      setActiveTab(index);
      if (onTabChange) {
        onTabChange(index);
      }
    }
  }, [hash, index, onTabChange]);

  const handleTabChange = useMemo(
    () => (newValue: number) => {
      setActiveTab(newValue);
      if (onTabChange) {
        onTabChange(newValue);
      }

      const selectedTabHash = hashes[newValue];
      if (selectedTabHash) {
        navigate({ hash: selectedTabHash }, { replace: true });
      } else {
        navigate({ hash: "" }, { replace: true });
      }
    },
    [hashes, navigate, onTabChange],
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
          {Object.values(tabs).map((tab, index) => (
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
          {Object.values(tabs).map((tab, index) => (
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
