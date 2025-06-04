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

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN; // Auth0 domain from Vite env
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID; // Add this to your .env file

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Auth0Provider
            domain={auth0Domain}
            clientId={auth0ClientId}
            authorizationParams={{
                redirect_uri: window.location.origin,
                audience: import.meta.env.VITE_KYD_API_AUDIENCE,
                scope: 'openid profile email'
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
