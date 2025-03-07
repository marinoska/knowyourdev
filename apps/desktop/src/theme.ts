import { extendTheme } from '@mui/joy/styles';

// Extend the typography definitions by adding custom levels like body1
// declare module '@mui/joy/styles' {
//     interface CssVarsThemeOptions {
//         vars?: {
//             Sidebar?: {
//                 width?: string;
//             };
//         };
//     }
// }

const theme = extendTheme({
    fontSize: {
        sm: '18px', // Example font sizes
        md: '20px',
        lg: '22px',
    },
    colorSchemes: {
        light: {
            palette: {
                text: {
                    secondary: '#ffffff', // Subtle gray color for menu items
                },
                background: {
                    backdrop: '#3F51B5', // New backdrop color (Dark Blue)
                    level1: '#4558C0', // New backdrop color (Dark Blue)
                    body: '#f5f5f5', // Default body background color
                    surface: '#ffffff', // Background for surfaces like cards or sheets
                },
            },
        },
        dark: {
            palette: {
                text: {
                    secondary: '#ffffff', // Subtle gray color for menu items
                },
                background: {
                    backdrop: '#0F172A', // Different color for dark mode
                    body: '#F9FAFB', // Default body background color
                    surface: '#ffffff', // Background for surfaces like cards or sheets
                },
            },
        },
    },
});

export default theme;
