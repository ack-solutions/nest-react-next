import Box, { BoxProps } from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useState } from 'react';


export const StyledBgFlag = styled(Box)<BoxProps>(({ theme }) => ({
    width: 24,
    height: 24,
    flexShrink: 0,
    overflow: 'hidden',
    display: 'inline-flex',
    backgroundColor: theme.palette.grey[100],
    position: 'relative',
    borderRadius: 2,
    border: `1px solid ${theme.palette.divider}`,
}));

// Fallback component for when flag image fails to load
const FlagFallback = ({ iso }: { iso?: string }) => (
    <Box
        sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold',
            color: 'text.secondary',
            backgroundColor: 'grey.200',
        }}
    >
        {iso?.toUpperCase() || '??'}
    </Box>
);

export function FlagImage({ iso }: { iso?: string }) {
    const [imageError, setImageError] = useState(false);

    if (!iso || imageError) {
        return (
            <StyledBgFlag component="span">
                <FlagFallback iso={iso} />
            </StyledBgFlag>
        );
    }

    const flagSrc = `/assets/flag-icons/${iso.toLowerCase()}.webp`;

    return (
        <StyledBgFlag component="span">
            <img
                src={flagSrc}
                alt={`${iso.toUpperCase()} flag`}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
                onError={() => setImageError(true)}
                onLoad={() => setImageError(false)}
            />
        </StyledBgFlag>
    );
}
