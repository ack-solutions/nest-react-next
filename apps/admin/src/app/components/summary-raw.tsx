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
        <Box py={0.5}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
            >
                <Typography
                    width={160}
                    color="text.secondary"
                    {...labelProps}
                >
                    {label}
                </Typography>

                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                >
                    <Typography
                        width={160}
                        variant="subtitle2"
                        {...valueProps}
                    >
                        {value}
                    </Typography>
                    {action || (
                        <Box
                            width={32}
                        />
                    )}
                </Stack>
            </Stack>
        </Box>
    );
}

export default SummaryRaw;
