import { SvgIcon, SvgIconProps, SxProps } from '@mui/material';
import { useMemo } from 'react';

import { IconEnum } from './icons';
import selection from './selection.json';


interface IconProps extends SvgIconProps {
    sx?: SxProps;
    icon: IconEnum;
    size?: 'x-small' | 'small' | 'medium' | 'large' | 'x-large' | 'inherit' | number;
    offset?: number;
    strokeWidth?: number;
}

export interface IconMap {
    name: string;
    paths: Array<string>;
}

export function Icon({
    icon,
    sx,
    size = 18,
    className,
    offset = 0,
    strokeWidth = 1,
    ...props
}: IconProps) {
    const sizeNumber = useMemo(() => {
        switch (size) {
            case 'x-small':
                return 12;
            case 'small':
                return 14;
            case 'medium':
                return 18;
            case 'large':
                return 24;
            case 'x-large':
                return 28;
            case 'inherit':
                return 18;
            default:
                return typeof size === 'number' ? size : 18;
        }
    }, [size]);

    const viewBoxMax = 1024;
    const localOffset = (offset / 2) * -viewBoxMax;
    const offsetViewBox = viewBoxMax - localOffset;

    const currentIcon: IconMap | undefined = useMemo(() => {
        if (selection && selection.icons) {
            return selection.icons
                .map((i: any) => ({
                    name: i.properties.name,
                    paths: i.icon.paths,
                }))
                .find((i: IconMap) => i.name === icon);
        }
        return undefined;
    }, [icon]);

    return (
        <SvgIcon
            viewBox={`${localOffset} ${localOffset} ${offsetViewBox} ${offsetViewBox}`}
            className={className}
            sx={{
                width: sizeNumber,
                height: sizeNumber,
                ...sx,
            }}
            {...props}
        >
            {currentIcon?.paths?.map((p) => (
                <path
                    key={p}
                    d={p}
                    strokeWidth={5 * strokeWidth}
                />
            )) || null}
        </SvgIcon>
    );
}
