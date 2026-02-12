import { ASSETS } from '@admin/assets';
import Box, { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { memo, useEffect, useState } from 'react';


export const StyledBgFlag = styled(Box)<BoxProps>(({ theme }) => ({
    width: 24,
    height: 24,
    flexShrink: 0,
    // overflow: 'hidden',
    // display: 'inline-flex',
    position: 'relative',
}));

export interface FlagImageProps {
    iso?: string;
}

function FlagFallback({ iso }: { iso?: string }) {
    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'grey.200',
            }}
        >
            <Typography variant="caption" color="text.secondary" fontWeight="bold">
                {iso?.toUpperCase() ?? '??'}
            </Typography>
        </Box>
    );
}

function FlagImageComponent({ iso }: FlagImageProps) {
    const [imageError, setImageError] = useState(false);
    const flagSrc = iso ? ASSETS.flags.getFlag(iso) : '';

    // Reset error state when iso or resolved src changes (e.g. country change)
    useEffect(() => {
        setImageError(false);
    }, [iso, flagSrc]);

    if (!iso) {
        return (
            <StyledBgFlag component="span">
                <FlagFallback />
            </StyledBgFlag>
        );
    }

    if (imageError || !flagSrc) {
        return (
            <StyledBgFlag component="span">
                <FlagFallback iso={iso} />
            </StyledBgFlag>
        );
    }

    return (
        <StyledBgFlag component="span">
            <Box
                component="img"
                width="100%"
                height="100%"
                src={flagSrc}
                alt={`${iso.toUpperCase()} flag`}
                loading="lazy"
                onError={() => setImageError(true)}
                onLoad={() => setImageError(false)}
                sx={{ objectFit: 'contain' }}
            />
        </StyledBgFlag>
    );
}

export const FlagImage = memo(FlagImageComponent);
