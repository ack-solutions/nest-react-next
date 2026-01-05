'use client';
import { Gift, ImageOff, Store, TicketPercent, User } from 'lucide-react';
import React from 'react';

type ImageType = 'user' | 'store' | 'voucher' | 'coupon' | 'default';
type LoadingState = 'loading' | 'loaded' | 'error';

export interface ImageProps {
    src: string;
    alt: string;
    fallbackSrc?: string;
    width?: number | string;
    height?: number | string;
    aspectRatio?: '1:1' | '4:3' | '16:9' | '21:9' | 'auto';
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'circular';
    loading?: 'lazy' | 'eager';
    component?: React.ElementType;
    sx?: React.CSSProperties;
    slots?: {
        root?: React.ElementType;
        img?: React.ElementType;
        skeleton?: React.ElementType;
    };
    slotProps?: {
        root?: React.HTMLAttributes<HTMLElement>;
        img?: React.ImgHTMLAttributes<HTMLImageElement>;
        skeleton?: React.HTMLAttributes<HTMLElement>;
    };
    className?: string;
    style?: React.CSSProperties;
    onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    type?: ImageType;

}

/* ===== constants ===== */

const ASPECT_RATIO = {
    '1:1': '1 / 1',
    '4:3': '4 / 3',
    '16:9': '16 / 9',
    '21:9': '21 / 9',
    auto: 'auto',
};

const RADIUS = {
    none: '0',
    small: '4px',
    medium: '8px',
    large: '16px',
    circular: '50%',
};

const getPlaceholderIcon = (type: ImageType) => {
    const commonProps = {
        size: 32,
        strokeWidth: 1.5,
    };

    switch (type) {
        case 'user':
            return <User {...commonProps} />;
        case 'store':
            return <Store {...commonProps} />;
        case 'voucher':
            return <TicketPercent {...commonProps} />;
        case 'coupon':
            return <Gift {...commonProps} />;
        default:
            return <ImageOff {...commonProps} />;
    }
};

/* ===== component ===== */

export const Image: React.FC<ImageProps> = ({
    src,
    alt,
    fallbackSrc,
    width,
    height,
    aspectRatio = 'auto',
    objectFit = 'cover',
    borderRadius = 'none',
    loading = 'eager',
    component: Component = 'div',
    sx,
    slots,
    slotProps,
    className = '',
    style,
    onLoad,
    onError,
    type = 'default',
}) => {
    // Convert empty string to undefined to prevent browser warning
    const normalizedSrc = src && src.trim() !== '' ? src : undefined;
    const [currentSrc, setCurrentSrc] = React.useState(normalizedSrc);
    // If no src initially, show error state (placeholder icon)
    const [state, setState] = React.useState<LoadingState>(normalizedSrc ? 'loading' : 'error');
    const [hasError, setHasError] = React.useState(false);
    const imgRef = React.useRef<HTMLImageElement | null>(null);

    /* reset when src changes */
    React.useEffect(() => {
        const normalized = src && src.trim() !== '' ? src : undefined;
        setCurrentSrc(normalized);
        setState(normalized ? 'loading' : 'error');
        setHasError(false);
    }, [src]);

    /* handle cached images (CRITICAL) */
    React.useEffect(() => {
        const img = imgRef.current;
        if (img && img.complete && img.naturalWidth > 0) {
            setState('loaded');
        }
    }, [currentSrc]);

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        setState('loaded');
        onLoad?.(e);
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        if (!hasError && fallbackSrc && currentSrc !== fallbackSrc) {
            setHasError(true);
            setCurrentSrc(fallbackSrc);
            setState('loading');
        } else {
            setState('error');
        }
        onError?.(e);
    };

    const Root = slots?.root || Component;
    const Img = slots?.img || 'img';
    const Skeleton = slots?.skeleton || 'div';

    return (
        <>
            <style>{`
        @keyframes skeleton-pulse {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

            <Root
                className={`mui-image-root ${className}`}
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                    width: width ?? '100%',
                    height: aspectRatio === 'auto' ? height : undefined,
                    aspectRatio: ASPECT_RATIO[aspectRatio],
                    borderRadius: RADIUS[borderRadius],
                    background:
                        state === 'loading'
                            ? 'rgba(145,158,171,.08)'
                            : 'transparent',
                    ...sx,
                    ...style,
                }}
                {...slotProps?.root}
            >
                {currentSrc ? (
                    <Img
                        ref={Img === 'img' ? imgRef : undefined}
                        src={currentSrc}
                        alt={alt}
                        loading={loading}
                        onLoad={handleLoad}
                        onError={handleError}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit,
                            opacity: state === 'loaded' ? 1 : 0,
                            transition: 'opacity .3s ease',
                            inset: 0,
                            ...slotProps?.img?.style,
                        }}
                        {...slotProps?.img}
                    />
                ) : null}

                {state === 'loading' && currentSrc && (
                    <Skeleton
                        style={{
                            background:
                                'linear-gradient(90deg, rgba(145,158,171,.08), rgba(145,158,171,.16), rgba(145,158,171,.08))',
                            backgroundSize: '200% 100%',
                            animation: 'skeleton-pulse 1.5s infinite',
                            ...slotProps?.skeleton?.style,
                        }}
                        {...slotProps?.skeleton}
                    />
                )}

                {(!currentSrc || state === 'error') && !fallbackSrc && (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'none',
                            color: 'rgba(145,158,171,0.7)',
                        }}
                    >
                        {getPlaceholderIcon(type)}
                    </div>
                )}
            </Root>
        </>
    );
};

export default Image;
