import { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


type SearchNotFoundProps = BoxProps & {
    query?: string;
    title?: string;
    action?: React.ReactNode;
};

export function SearchNotFound({ query, title, action, sx, ...other }: SearchNotFoundProps) {
    if (!query) {
        return (
            <Box
                sx={{
                    textAlign: 'center',
                    ...sx,
                }}
                {...other}
            >
                <Typography
                    variant="body2"
                    textAlign="center"
                    sx={{
                        mb: 1,
                        typography: 'h6',
                    }}
                >
                    {title || 'No Result Found'}
                </Typography>
                {action}
            </Box>
        );
    }

    return (
        <Box
            sx={{
                textAlign: 'center',
                borderRadius: 1.5,
                ...sx,
            }}
            {...other}
        >
            <Box
                sx={{
                    mb: 1,
                    typography: 'h6',
                }}
            >
                {title || 'Not found'}
            </Box>
            <Typography variant="body2">
                No results found for
                {' '}
                <strong>{`"${query}"`}</strong>
                . Please try again with different keywords.
            </Typography>
            {action}
        </Box>
    );
}
