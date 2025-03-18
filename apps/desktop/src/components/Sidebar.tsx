import React from "react";
import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import LinearProgress from '@mui/joy/LinearProgress';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DashboardIcon from '@mui/icons-material/BarChart';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SupportRoundedIcon from '@mui/icons-material/SupportRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import BrightnessAutoRoundedIcon from '@mui/icons-material/BrightnessAutoRounded';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { closeSidebar } from '../utils';

// Navigation Configuration
const routes = [
    {
        path: '/dashboard',
        label: 'Dashboard',
        icon: HomeRoundedIcon
    },
    {
        path: '/uploads',
        label: 'Uploaded CVs',
        icon: UploadFileIcon
    },
    {
        path: '/support',
        label: 'Support',
        icon: DashboardIcon
    }
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
    const selectedColor = 'var(--joy-palette-background-level1) !important';
    const styles = {
        backgroundColor: 'inherit',
    };
    if (selected) {
        styles.backgroundColor = selectedColor;
    }

    return (
        <ListItemButton
            component={RouterLink}
            to={path}
            selected={selected}
            sx={{...styles, '&:hover': {backgroundColor: selectedColor}}}
        >
            <Icon/>
            <ListItemContent>
                <Typography level="body-md">{label}</Typography>
            </ListItemContent>
        </ListItemButton>
    );
};

export default function Sidebar() {
    const location = useLocation();
    return (
        <Sheet
            className="Sidebar"
            sx={{
                position: {xs: 'fixed', md: 'sticky'},
                transform: {
                    xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
                    md: 'none',
                },
                transition: 'transform 0.4s, width 0.4s',
                zIndex: 10000,
                height: '100dvh',
                // width: '288px',
                width: 'var(--Sidebar-width)',
                top: 0,
                p: 0,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRight: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'var(--joy-palette-background-level2)',
                color: 'var(--joy-palette-text-level1Contrast)',   // Use the secondary color from the theme
                '& *': {
                    color: 'inherit !important',
                },
            }}
        >
            <GlobalStyles
                styles={(theme) => ({
                    ':root': {
                        '--Sidebar-width': '240 px',
                        [theme.breakpoints.up('lg')]: {
                            '--Sidebar-width': '288px',
                        },
                    },
                })}
            />
            <Box
                className="Sidebar-overlay"
                sx={{
                    position: 'fixed',
                    zIndex: 9998,
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    opacity: 'var(--SideNavigation-slideIn)',
                    transition: 'opacity 0.4s',
                    transform: {
                        xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
                        lg: 'translateX(-100%)',
                    },
                }}
                onClick={() => closeSidebar()}
            />
            <Box sx={{display: 'flex', gap: 1, pt: 2, pb: 2, alignItems: 'center'}}>
                <IconButton variant="soft" size="sm">
                    <BrightnessAutoRoundedIcon/>
                </IconButton>
                <Typography level="title-lg">KnowYourDev.</Typography>
            </Box>
            <Box
                sx={{
                    minHeight: 0,
                    overflow: 'hidden auto',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    [`& .${listItemButtonClasses.root}`]: {
                        gap: 2,
                    },
                }}
            >
                <List size="lg">
                    {routes.map((route, index) => (
                        <NavigationItem
                            key={route.path} // Unique key for each route
                            label={route.label}
                            icon={route.icon}
                            path={route.path}
                            selected={location.pathname === route.path} // Dynamically check if the route matches the current path
                        />
                    ))}
                    <Divider/>
                </List>

                <Box sx={{p: 3}}>

                    <Card
                        invertedColors
                        variant="soft"
                        color="warning"
                        size="sm"
                        sx={{boxShadow: 'none'}}
                    >
                        <Stack
                            direction="row"
                            sx={{justifyContent: 'space-between', alignItems: 'center'}}
                        >
                            <Typography level="title-sm">Used space</Typography>
                            <IconButton size="sm">
                                <CloseRoundedIcon/>
                            </IconButton>
                        </Stack>
                        <Typography level="body-xs">
                            Your team has used 80% of your available space. Need more?
                        </Typography>
                        <LinearProgress variant="outlined" value={80} determinate sx={{my: 1}}/>
                        <Button size="sm" variant="solid">
                            Upgrade plan
                        </Button>
                    </Card>
                </Box>
                <Divider/>
                <Box sx={{display: 'flex', gap: 1, p: 2, alignItems: 'center'}}>
                    <Avatar
                        variant="outlined"
                        size="sm"
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                    />
                    <Box sx={{minWidth: 0, flex: 1}}>
                        <Typography level="title-sm">Siriwat K.</Typography>
                        <Typography level="body-xs">siriwatk@test.com</Typography>
                    </Box>
                    <IconButton size="sm" variant="plain" color="neutral">
                        <LogoutRoundedIcon/>
                    </IconButton>
                </Box>
            </Box>

        </Sheet>
    );
}
