import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StyledEngineProvider } from "@mui/joy";
import App from './App.tsx'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <StyledEngineProvider injectFirst>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </StyledEngineProvider>
        </QueryClientProvider>
    </StrictMode>
)
