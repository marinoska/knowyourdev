import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import theme from "./theme";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { ResumeList } from "@/pages/Resume/ResumeList.tsx";
import { ResumeDetailsPage } from "@/pages/Resume/ResumeDetailsPage.tsx";
import { ProjectsList } from "@/pages/Projects/ProjectsList.tsx";
import { ProjectDetailsPage } from "@/pages/Projects/ProjectDetailsPage/ProjectDetailsPage.tsx";
import { CandidateMatchPage } from "@/pages/Projects/CandidateMatchPage/CandidateMatchPage.tsx";
import { useAuth0 } from "@auth0/auth0-react";
import Loader from "@/components/Loader.tsx";
import { ApiClientProvider } from "@/api/ApiClientProvider.tsx";
import { ErrorBoundary } from "@/components/ErrorBoundary.tsx";
import { PageContextProvider } from "@/core/contexts/PageContext.tsx";

const NotFound = () => {
  return <div>Not Found</div>;
};

const Dashboard = () => {
  return <div>Nothing here yet...</div>;
};

export default function App() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  const shouldAutoLogin = window.location.pathname === "/auth/login";
  if (shouldAutoLogin && !isAuthenticated && !isLoading) {
    void loginWithRedirect({
      authorizationParams: {
        audience: import.meta.env.VITE_KYD_API_AUDIENCE,
        redirect_uri: window.location.origin + "/projects",
      },
    });
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return null;
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
                md: 1.5,
              },
              pb: { xs: 2, sm: 2, md: 3 },
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              height: "100dvh",
              gap: 0,
            }}
          >
            <PageContextProvider>
              <Routes>
                <Route path="/" element={<Navigate to="/projects" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<ProjectsList />} />
                <Route path="/projects/:id" element={<ProjectDetailsPage />} />
                <Route
                  path="/projects/:id/candidates/:candidateId"
                  element={
                    <ErrorBoundary>
                      <CandidateMatchPage />
                    </ErrorBoundary>
                  }
                />
                <Route path="/uploads" element={<ResumeList />} />
                <Route path="/uploads/:id" element={<ResumeDetailsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageContextProvider>
          </Box>
        </Box>
      </CssVarsProvider>
    </ApiClientProvider>
  );
}
