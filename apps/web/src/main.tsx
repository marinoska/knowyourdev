import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StyledEngineProvider } from "@mui/joy";
import App from './App.tsx'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { Auth0Provider } from "@auth0/auth0-react";


const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Auth0Provider
            domain="mo-14.eu.auth0.com"
            clientId="LBfq1eop6G9I44e6ZBwfVRIy2WOLJdAp"
            authorizationParams={{
                redirect_uri: "http://localhost:5173",
                // redirect_uri: window.location.origin,
            }}
        >
            <QueryClientProvider client={queryClient}>
                <StyledEngineProvider injectFirst>
                    <BrowserRouter>
                        <App/>
                    </BrowserRouter>
                </StyledEngineProvider>
            </QueryClientProvider>
        </Auth0Provider>
    </StrictMode>
)
