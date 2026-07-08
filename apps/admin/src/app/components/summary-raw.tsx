import { Box, Stack, Typography, TypographyProps } from '@mui/material';


interface SummaryRawProps {
    label: string;
    value: string;
    action?: React.ReactNode;
    labelProps?: TypographyProps;
    valueProps?: TypographyProps;
}

function SummaryRaw({ label, value, action, labelProps, valueProps }: SummaryRawProps) {
    return (
        <Box sx={{
            py: 0.5
        }}>
            <Stack
                direction="row"
                spacing={1}
                sx={{
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                <Typography
                    {...labelProps}
                    sx={[{
                        width: 160,
                        color: "text.secondary"
                    }, ...(Array.isArray(labelProps.sx) ? labelProps.sx : [labelProps.sx])]}>
                    {label}
                </Typography>

                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        alignItems: "center"
                    }}
                >
                    <Typography
                        variant="subtitle2"
                        {...valueProps}
                        sx={[{
                            width: 160
                        }, ...(Array.isArray(valueProps.sx) ? valueProps.sx : [valueProps.sx])]}>
                        {value}
                    </Typography>
                    {action || (
                        <Box
                            sx={{
                                width: 32
                            }}
                        />
                    )}
                </Stack>
            </Stack>
        </Box>
    );
}

export default SummaryRaw;
