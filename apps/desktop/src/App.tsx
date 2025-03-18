import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import theme from './theme';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { UploadedCVList } from "./pages/UploadedCVList.js";
import { useMemo } from "react";

const NotFound = () => {
    return <div>Not Found</div>
}

const Dashboard = () => {
    return <div>Dashboard</div>
}
const CVDetails = () => {
    return <div>CVDetails</div>
}

const routeMapping: { [key: string]: string } = {
    dashboard: 'Dashboard',
    uploads: 'Uploaded CV',
};

const BreadcrumbsComponent = () => {
    const location = useLocation();
    const breadcrumbs = useMemo(() => {
        const pathnames = location.pathname.split('/').filter(Boolean); // Split path and remove empty parts

        return pathnames.map((pathname, index) => {
            const pathTo = `/${pathnames.slice(0, index + 1).join('/')}`; // Construct URL

            return {
                label: routeMapping[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1), // Default to capitalized segment
                path: pathTo,
                isLast: index === pathnames.length - 1, // Check if it's the last breadcrumb
            };
        });
    }, [location]);

    return (
        <Breadcrumbs
            size="sm"
            separator={<ChevronRightRoundedIcon fontSize="small"/>}
            sx={{pl: 0}}
        >
            <Link
                underline="none"
                color="neutral"
                component={RouterLink}
                to="/dashboard"
            >
                <HomeRoundedIcon/>
            </Link>
            {breadcrumbs.map((breadcrumb, index) =>
                breadcrumb.isLast ? (
                    <Typography color="primary" key={index}>
                        {breadcrumb.label}
                    </Typography>
                ) : (
                    <Link
                        underline="hover"
                        color="neutral"
                        component={RouterLink}
                        to={breadcrumb.path}
                        key={index}
                        sx={{fontSize: 12, fontWeight: 500}}
                    >
                        {breadcrumb.label}
                    </Link>
                )
            )}
        </Breadcrumbs>
    );
};

export default function App() {
    return (
        <CssVarsProvider theme={theme} defaultMode="light" disableTransitionOnChange>
            <CssBaseline/>
            <Box sx={{display: 'flex', minHeight: '100dvh'}}>
                <Header/>
                <Sidebar/>
                <Box
                    component="main"
                    className="MainContent"
                    sx={{
                        px: {xs: 2, md: 6},
                        pt: {
                            xs: 'calc(12px + var(--Header-height))',
                            sm: 'calc(12px + var(--Header-height))',
                            md: 3,
                        },
                        pb: {xs: 2, sm: 2, md: 3},
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        height: '100dvh',
                        gap: 1,
                    }}
                >
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <BreadcrumbsComponent/>
                    </Box>
                    <Routes>
                        <Route path="/" element={<Dashboard/>}/>
                        <Route path="/dashboard" element={<Dashboard/>}/>
                        <Route path="/uploads" element={<UploadedCVList/>}/>
                        <Route path="/uploads/:id" element={<CVDetails/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}
