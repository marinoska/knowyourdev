import { extendTheme } from '@mui/joy/styles';

declare module '@mui/joy/styles' {
    interface Palette {
        secondary: {
            solidBg: string;
            solidHoverBg: string;
            solidActiveBg: string;
        };
    }

    interface PaletteColorOverrides {
        secondary: true; // Enables "secondary" as a valid palette color
    }
}

declare module '@mui/joy/Button' {
    interface ButtonPropsColorOverrides {
        secondary: true;
    }
}

const DarkBlue = '#003366';
const theme = extendTheme({
    fontSize: {
        sm: '16px', // Example font sizes
        md: '18px',
        lg: '20px',
    },

    components: {
        // JoyButton: {
        //     styleOverrides: {
        //         root: {
        //             color: 'secondary',
        //         },
        //     },
        // },
    },
    colorSchemes: {
        light: {
            palette: {
                text: {
                    secondary: DarkBlue,
// @ts-ignore
                    level1Contrast: '#FFFFFF', // Set contrast text to white for the sidebar
                },
                primary: {
                    solidBg: '#00A676',       // Normal primary action button background
                    solidHoverBg: '#008F63',  // Used on hover for primary elements
                    solidActiveBg: '#007750', // Active state (clicked)
                    // softBg: '#E6F4F1',        // A soft, subtle background shade for hover effects
                    // softHoverBg: '#CCE9E4',   // Slightly darker hover for less active elements (optional)
                },
                secondary: {
                    solidBg: DarkBlue,       // Normal primary action button background
                    solidHoverBg: '#004080',   // Slightly lighter for hover state
                    solidActiveBg: '#002244',  // Slightly darker for active state
// @ts-ignore
                    solidColor: '#FFFFFF',    // Text color for the button
                },
                background: {
                    level2: DarkBlue, // New sidebar color (Dark Blue)
                    level1: '#004480', // New sidebar color (Dark Blue)
                    body: '#F0F0F5', // Default body background color
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
                    body: '#F9FAFB', // Default body background color
                    surface: '#ffffff', // Background for surfaces like cards or sheets
                },
            },
        },
    },
});

export default theme;
