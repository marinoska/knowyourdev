import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import theme from "./theme";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { UploadedList } from "./pages/Upload/UploadedList.tsx";
import { UploadedProfile } from "@/pages/Upload/UploadedProfile.tsx";
import { ProjectsList } from "@/pages/Projects/ProjectsList.tsx";
import { ProjectProfile } from "@/pages/Projects/Details/ProjectProfile.tsx";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/joy/Button";
import KnowYourDevIcon from "@/components/KnowYourDevIcon.tsx";
import Loader from "@/components/Loader.tsx";
import { ApiClientProvider } from "@/api/ApiClientProvider.tsx";

const NotFound = () => {
  return <div>Not Found</div>;
};

const Dashboard = () => {
  return <div>Dashboard</div>;
};

export default function App() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return (
      <Box
        alignItems="center"
        width="100%"
        display="flex"
        justifyContent="center"
        pt={10}
      >
        <Button
          size="lg"
          onClick={() => loginWithRedirect()}
          startDecorator={<KnowYourDevIcon />}
        >
          Log In
        </Button>
      </Box>
    );
  }

  return (
    <ApiClientProvider>
      <CssVarsProvider
        theme={theme}
        defaultMode="light"
        disableTransitionOnChange
      >
        <CssBaseline />
        <Box sx={{ display: "flex", minHeight: "100dvh" }}>
          <Header />
          <Sidebar />
          <Box
            component="main"
            className="MainContent"
            sx={{
              px: { xs: 2, md: 3 },
              pt: {
                xs: "calc(12px + var(--Header-height))",
                sm: "calc(12px + var(--Header-height))",
                md: 3,
              },
              pb: { xs: 2, sm: 2, md: 3 },
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              height: "100dvh",
              gap: 1,
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<ProjectsList />} />
              <Route path="/projects/:id" element={<ProjectProfile />} />
              <Route path="/uploads" element={<UploadedList />} />
              <Route path="/uploads/:id" element={<UploadedProfile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </Box>
      </CssVarsProvider>
    </ApiClientProvider>
  );
}
