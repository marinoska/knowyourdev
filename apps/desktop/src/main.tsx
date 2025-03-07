import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StyledEngineProvider } from "@mui/joy";
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <StyledEngineProvider injectFirst>
            <App/>
        </StyledEngineProvider>
    </StrictMode>
)
