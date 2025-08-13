import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import theme from "./theme";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
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
import { useEffect } from "react";
import { LandingPage } from "@/pages/Landing/LandingPage";

const NotFound = () => {
  return <div>Not Found</div>;
};

const Dashboard = () => {
  return <div>Nothing here yet...</div>;
};

function ProtectedLayout() {
  return (
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
            height: "100dvh",
          }}
        >
          <ErrorBoundary>
            <PageContextProvider>
              <Outlet />
            </PageContextProvider>
          </ErrorBoundary>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}

const REDIRECT_URI = window.location.origin + "/projects";

function Login() {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    void loginWithRedirect({
      authorizationParams: {
        audience: import.meta.env.VITE_KYD_API_AUDIENCE,
        redirect_uri: REDIRECT_URI,
      },
    });
  }, [loginWithRedirect]);

  return <Loader />;
}

function RedirectToLogin() {
  const location = useLocation();
  const returnTo = encodeURIComponent(location.pathname + location.search);
  return <Navigate to={`/auth/login?returnTo=${returnTo}`} replace />;
}

export default function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <Loader />;

  return (
    <ApiClientProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login" element={<Login />} />

        {/* Protected routes */}
        {isAuthenticated ? (
          <Route path="/" element={<ProtectedLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/:id" element={<ProjectDetailsPage />} />
            <Route
              path="projects/:id/candidates/:candidateId"
              element={<CandidateMatchPage />}
            />
            <Route path="uploads" element={<ResumeList />} />
            <Route path="uploads/:id" element={<ResumeDetailsPage />} />
          </Route>
        ) : (
          <>
            <Route path="/dashboard/*" element={<RedirectToLogin />} />
            <Route path="/projects/*" element={<RedirectToLogin />} />
            <Route path="/uploads/*" element={<RedirectToLogin />} />
          </>
        )}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ApiClientProvider>
  );
}
