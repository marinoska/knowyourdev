import React from "react";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Tooltip from "@mui/joy/Tooltip";
// import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { Link as RouterLink, useLocation } from "react-router-dom";

import { closeSidebar } from "../utils";
import KnowYourDevIcon from "./KnowYourDevIcon";
import { useAuth0 } from "@auth0/auth0-react";
import { Regular } from "@/components/typography.tsx";

const routes = [
  // {
  //   path: "/dashboard",
  //   label: "Dashboard",
  //   icon: HomeRoundedIcon,
  // },
  {
    path: "/projects",
    label: "Projects",
    icon: BusinessCenterIcon,
  },
  {
    path: "/uploads",
    label: "CV List",
    icon: UploadFileIcon,
  },
];

const NavigationItem = ({
  icon: Icon,
  label,
  path,
  selected,
}: {
  icon: React.ElementType;
  label: string;
  path: string;
  selected?: boolean;
}) => {
  const selectedColor = "var(--joy-palette-background-level1) !important";
  const styles = {
    backgroundColor: "inherit",
  };
  if (selected) {
    styles.backgroundColor = selectedColor;
  }

  return (
    <ListItemButton
      component={RouterLink}
      to={path}
      selected={selected}
      sx={{ ...styles, "&:hover": { backgroundColor: selectedColor } }}
    >
      <Icon />
      <ListItemContent>
        <Regular>{label}</Regular>
      </ListItemContent>
    </ListItemButton>
  );
};

export default function Sidebar() {
  const location = useLocation();
  const { logout, user } = useAuth0();

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: "translateX(calc(-100% + var(--SideNavigation-slideIn, 0) * 100%))",
          md: "none",
        },
        left: 0,
        transition: "transform 0.4s, width 0.4s",
        zIndex: 2,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 0,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
        backgroundColor: "var(--joy-palette-background-level2)",
        color: "var(--joy-palette-text-level1Contrast)", // Use the secondary color from the theme
        "& *": {
          color: "inherit !important",
        },
      }}
    >
      <GlobalStyles
        styles={() => ({
          ":root": {
            "--Sidebar-width": "240px",
            "--Overlay-pointerEvents": "none",
          },
          "html[data-sidebar-open='true']": {
            "--Overlay-pointerEvents": "auto",
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 1,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          transition: "opacity 0.4s",
          transform: {
            xs: "none",
            lg: "translateX(-100%)",
          },
          pointerEvents: "var(--Overlay-pointerEvents)",
          // Ensure the overlay doesn't cover the sidebar itself
          marginLeft: "var(--Sidebar-width)",
        }}
        onClick={() => closeSidebar()}
      />
      <Box
        sx={{ display: "flex", gap: 1.5, pt: 2, pl: 2, alignItems: "center" }}
      >
        <KnowYourDevIcon fontSize="xl4" />
        <Typography level="title-lg">KnowYourDev</Typography>
      </Box>
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 2,
          },
        }}
      >
        <List size="lg">
          {routes.map((route) => (
            <NavigationItem
              key={route.path} // Unique key for each route
              label={route.label}
              icon={route.icon}
              path={route.path}
              selected={location.pathname === route.path} // Dynamically check if the route matches the current path
            />
          ))}
          <Divider />
        </List>

        {/*<Box sx={{p: 3}}>*/}

        {/*    <Card*/}
        {/*        invertedColors*/}
        {/*        variant="soft"*/}
        {/*        color="warning"*/}
        {/*        size="sm"*/}
        {/*        sx={{boxShadow: 'none'}}*/}
        {/*    >*/}
        {/*        <Stack*/}
        {/*            direction="row"*/}
        {/*            sx={{justifyContent: 'space-between', alignItems: 'center'}}*/}
        {/*        >*/}
        {/*            <Typography level="title-sm">Used space</Typography>*/}
        {/*            <IconButton size="sm">*/}
        {/*                <CloseRoundedIcon/>*/}
        {/*            </IconButton>*/}
        {/*        </Stack>*/}
        {/*        <Typography level="body-xs">*/}
        {/*            Your team has used 80% of your available space. Need more?*/}
        {/*        </Typography>*/}
        {/*        <LinearProgress variant="outlined" value={80} determinate sx={{my: 1}}/>*/}
        {/*        <Button size="sm" variant="solid">*/}
        {/*            Upgrade plan*/}
        {/*        </Button>*/}
        {/*    </Card>*/}
        {/*</Box>*/}
        <Divider />
        <Box sx={{ display: "flex", gap: 1, p: 2, alignItems: "center" }}>
          <Avatar variant="outlined" size="md" />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Tooltip
              title={user?.name || ""}
              placement="top"
              sx={{ zIndex: 5 }}
              arrow
              disableFocusListener
            >
              <div style={{ width: "100%" }}>
                <Typography
                  level="title-sm"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  {user?.name}
                </Typography>
              </div>
            </Tooltip>
            <Tooltip
              title={user?.email || ""}
              placement="top"
              sx={{ zIndex: 5 }}
              arrow
              disableFocusListener
            >
              <div style={{ width: "100%" }}>
                <Typography
                  level="body-xs"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  {user?.email}
                </Typography>
              </div>
            </Tooltip>
          </Box>
          <IconButton
            size="md"
            variant="plain"
            color="neutral"
            sx={{
              "&:hover": {
                backgroundColor: "transparent", // Or any option above
                transition: "transform 0.3s ease",
                transform: "translateX(4px)",
              },
            }}
            onClick={() =>
              logout({
                logoutParams: { returnTo: window.location.origin },
              })
            }
          >
            <LogoutRoundedIcon />
          </IconButton>
        </Box>
      </Box>
    </Sheet>
  );
}
