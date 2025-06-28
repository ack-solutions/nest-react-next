import { Box, Skeleton } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';


interface ImageWithFallbackProps {
    src?: string;
    alt: string; // Made required
    width?: number | string;
    height?: number | string;
    objectFit?: React.CSSProperties['objectFit'];
    aspectRatio?: number;
    sx?: object;
    className?: string;
    type?: 'product' | 'location'
}

function Image({
    src,
    alt,
    width = '100%',
    height = 'auto',
    objectFit = 'cover',
    aspectRatio = 1,
    type = 'product',
    sx,
    className,
}: ImageWithFallbackProps) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(!src);

    const fallbackSrc = useMemo(() => {
        switch (type) {
            case 'product':
                return '/assets/images/product-place-holder.jpg';
            case 'location':
                return '/assets/images/location-placeholder.png';

            default:
                return '/assets/images/image-placeholder.png';
        }
    }, [type]);

    useEffect(() => {
        setLoaded(false);
        setError(!src);
    }, [src]);
    return (
        <Box
            sx={{
                width,
                height: aspectRatio ? undefined : height,
                aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
                position: 'relative',
                display: 'inline-block',
                overflow: 'hidden',
                ...sx,
            }}
            className={className}
        >
            {!loaded && !error && (
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                />
            )}

            <Box
                component="img"
                src={error ? fallbackSrc : src}
                alt={alt}
                loading="lazy"
                sx={{
                    position: aspectRatio ? 'absolute' : 'static',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit,
                    display: 'block',
                }}
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
            />
        </Box>
    );
}

export default Image;
