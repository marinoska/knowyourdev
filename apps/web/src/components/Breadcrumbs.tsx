import { useMemo } from "react";
import MUIBreadcrumbs from "@mui/joy/Breadcrumbs";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Link from "@mui/joy/Link";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Typography from "@mui/joy/Typography";
import { Link as RouterLink, useLocation } from 'react-router-dom';

const routeMapping: { [key: string]: string } = {
    dashboard: 'Dashboard',
    uploads: 'CV List',
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
        <MUIBreadcrumbs
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
        </MUIBreadcrumbs>
    );
};

export const Breadcrumbs = BreadcrumbsComponent;