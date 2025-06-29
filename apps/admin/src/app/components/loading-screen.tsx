import { Box, GlobalStyles } from '@mui/material';
import { useTheme } from '@mui/material/styles';


// ----------------------------------------------------------------------

interface LoadingScreenProps {
    sx?: object;
}

export default function LoadingScreen({
    sx,
    ...other
}: LoadingScreenProps) {
    const theme = useTheme();

    return (
        <>
            <GlobalStyles
                styles={{
                    body: {
                        overflow: 'hidden',
                    },
                }}
            />

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    width: '100%',
                    flexDirection: 'column',
                    gap: 2,
                    ...sx,
                }}
                {...other}
            >
                {/* Custom Spinner */}
                <Box
                    sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        border: `4px solid ${theme.palette.divider}`,
                        borderTop: `4px solid ${theme.palette.primary.main}`,
                        animation: 'spin 1s linear infinite',
                    }}
                />

                {/* Loading Text */}
                <Box
                    sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        opacity: 0.8,
                    }}
                >
                    Loading...
                </Box>
            </Box>

            <GlobalStyles
                styles={{
                    '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                    },
                }}
                key="loading-screen-root-style"
            />
        </>
    );
}
