import * as React from 'react';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import Chip from '@mui/joy/Chip';
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
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import SupportRoundedIcon from '@mui/icons-material/SupportRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import BrightnessAutoRoundedIcon from '@mui/icons-material/BrightnessAutoRounded';

import { closeSidebar } from '../utils';
import theme from "../theme.js";

function Toggler({
                     defaultExpanded = false,
                     renderToggle,
                     children,
                 }: {
    defaultExpanded?: boolean;
    children: React.ReactNode;
    renderToggle: (params: {
        open: boolean;
        setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    }) => React.ReactNode;
}) {
    const [open, setOpen] = React.useState(defaultExpanded);
    return (
        <React.Fragment>
            {renderToggle({open, setOpen})}
            <Box
                sx={[
                    {
                        display: 'grid',
                        transition: '0.2s ease',
                        '& > *': {
                            overflow: 'hidden',
                        },
                    },
                    open ? {gridTemplateRows: '1fr'} : {gridTemplateRows: '0fr'},
                ]}
            >
                {children}
            </Box>
        </React.Fragment>
    );
}

export default function Sidebar() {
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
                backgroundColor: 'var(--joy-palette-background-backdrop)',
                color: 'var(--joy-palette-text-secondary)',   // Use the secondary color from the theme
                '& *': {
                    color: 'inherit !important',
                },
                '&[aria-selected="true"]': {
                    backgroundColor: '#000',
                    // backgroundColor: 'var(--joy-palette-primary-softBg)',
                    color: 'var(--joy-palette-primary-softColor)',
                    fontWeight: 'bold',
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
                <IconButton variant="soft" color="secondary" size="sm">
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
                        gap: 1.5,
                    },
                }}
            >
                <List
                    size="sm"
                    sx={{
                        '& .Mui-selected,  .MuiListItem-root :hover': {
                            backgroundColor: 'var(--joy-palette-background-level1) !important', // Black background for selected items
                        },
                        '& li': {pt: 1, pb: 1, m: 0},
                        '--List-nestedInsetStart': '30px',
                    }}
                >
                    <ListItem>
                        <ListItemButton>
                            <HomeRoundedIcon/>
                            <ListItemContent>
                                <Typography level="title-sm">Home</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>

                    <ListItem>
                        <ListItemButton>
                            <DashboardIcon/>
                            <ListItemContent>
                                <Typography level="title-sm">Dashboard</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>

                    <ListItem>
                        <ListItemButton selected>
                            <UploadFileIcon/>
                            <ListItemContent>
                                <Typography level="title-sm">Upload CV</Typography>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>

                    {/*<ListItem>*/}
                    {/*    <ListItemButton*/}
                    {/*        role="menuitem"*/}
                    {/*        component="a"*/}
                    {/*        href="/joy-ui/getting-started/templates/messages/"*/}
                    {/*    >*/}
                    {/*        <QuestionAnswerRoundedIcon/>*/}
                    {/*        <ListItemContent>*/}
                    {/*            <Typography level="title-sm">Messages</Typography>*/}
                    {/*        </ListItemContent>*/}
                    {/*        <Chip size="sm" color="primary" variant="solid">*/}
                    {/*            4*/}
                    {/*        </Chip>*/}
                    {/*    </ListItemButton>*/}
                    {/*</ListItem>*/}
                    <ListItem>
                        <ListItemButton>
                            <SupportRoundedIcon/>
                            Support
                        </ListItemButton>
                    </ListItem>

                </List>


                <Box sx={{p: 2}}>

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
