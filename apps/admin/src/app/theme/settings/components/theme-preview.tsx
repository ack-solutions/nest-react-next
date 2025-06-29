import { Box, Card, Stack, Typography, useTheme } from '@mui/material';


export default function ThemePreview() {
    const theme = useTheme();

    return (
        <Card sx={{
            p: 2,
            mb: 2,
        }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Theme Preview
            </Typography>
            <Box
                sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    border: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Stack spacing={1}>
                    {/* Header preview */}
                    <Box
                        sx={{
                            height: 8,
                            borderRadius: 0.5,
                            bgcolor: 'primary.main',
                        }}
                    />

                    {/* Content preview */}
                    <Stack direction="row" spacing={1}>
                        <Box
                            sx={{
                                width: 20,
                                height: 32,
                                borderRadius: 0.5,
                                bgcolor: 'background.default',
                                border: `1px solid ${theme.palette.divider}`,
                            }}
                        />
                        <Stack spacing={0.5} flex={1}>
                            <Box
                                sx={{
                                    height: 4,
                                    borderRadius: 0.25,
                                    bgcolor: 'text.primary',
                                    opacity: 0.8,
                                    width: '60%',
                                }}
                            />
                            <Box
                                sx={{
                                    height: 3,
                                    borderRadius: 0.25,
                                    bgcolor: 'text.secondary',
                                    opacity: 0.6,
                                    width: '40%',
                                }}
                            />
                            <Box
                                sx={{
                                    height: 3,
                                    borderRadius: 0.25,
                                    bgcolor: 'text.secondary',
                                    opacity: 0.4,
                                    width: '50%',
                                }}
                            />
                        </Stack>
                    </Stack>

                    {/* Button preview */}
                    <Box
                        sx={{
                            height: 6,
                            width: 24,
                            borderRadius: 0.5,
                            bgcolor: 'primary.main',
                            ml: 'auto',
                        }}
                    />
                </Stack>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{
                mt: 1,
                display: 'block',
            }}>
                Current: {theme.palette.mode} mode
            </Typography>
        </Card>
    );
}
