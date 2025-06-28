import { Box, Typography, TypographyProps } from '@mui/material';


interface TitleTextViewProps {
    label: string;
    labelProps?: TypographyProps;
    value: string;
    valueProps?: TypographyProps;
    fallback?: string;
}

export function TitleTextView({ label, value, fallback = '-', labelProps, valueProps }: TitleTextViewProps) {
    return (
        <Box sx={{ mb: 1 }}>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    ...labelProps?.sx,
                }}
                {...labelProps}
            >
                {label}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    mt: 0.5,
                    fontWeight: 500,
                    color: value ? 'text.primary' : 'text.secondary',
                    ...valueProps?.sx,
                }}
                {...valueProps}
            >
                {value || fallback}
            </Typography>
        </Box>
    );
}
