import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import theme from './theme';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { UploadedList } from "./pages/UploadedList.tsx";
import { UploadedProfile } from "@/pages/UploadedProfile.tsx";

const NotFound = () => {
    return <div>Not Found</div>
}

const Dashboard = () => {
    return <div>Dashboard</div>
}

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

                    <Routes>
                        <Route path="/" element={<Dashboard/>}/>
                        <Route path="/dashboard" element={<Dashboard/>}/>
                        <Route path="/uploads" element={<UploadedList/>}/>
                        <Route path="/uploads/:id" element={<UploadedProfile/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}
