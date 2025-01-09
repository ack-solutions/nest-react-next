import { SxProps, Typography, TypographyProps } from '@mui/material';
import { useMemo } from 'react';


interface IconProps extends Omit<TypographyProps, 'className' | 'variant'> {
  sx?: SxProps;
  icon: string;
  size?: 'x-small' | 'small' | 'medium' | 'large' | 'x-large' | number;
}

export function Icon({
    icon,
    sx,
    size='medium',
    ...other
}: IconProps) {
    const sizeNumber = useMemo(() => {
        switch (size) {
            case 'x-small':
                return 12;
            case 'small':
                return 15;
            case 'medium':
                return 18;
            case 'large':
                return 24;
            case 'x-large':
                return 28;
            default:
                return size;
        }
    }, [size]);


    return <Typography
        component={'i'}
        className={`icon-${icon}`}
        variant='inherit'
        sx={{
            ...sizeNumber ? {
                lineHeight: `${sizeNumber}px`,
                fontSize: `${sizeNumber}px`,
                height: `${sizeNumber}px`,
                width: `${sizeNumber}px`,
            } : {},
            lineHeight: 0,
            display: 'inline-block',
            ...sx,
        }}
        {...other}
    />;
}
