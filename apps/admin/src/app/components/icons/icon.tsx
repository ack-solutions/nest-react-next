import { SvgIcon, SvgIconProps, SxProps } from '@mui/material';
import { useMemo } from 'react';

import { IconEnum } from './icons';
import selection from './selection.json';


interface IconProps extends SvgIconProps {
    sx?: SxProps;
    icon: IconEnum;
    size?: 'x-small' | 'small' | 'medium' | 'large' | 'x-large' | 'inherit' | number;
    strokeWidth?: number;
}

export interface IconMap {
    name: string;
    content: string;
}

export function Icon({
    icon,
    sx,
    size = 18,
    className,
    strokeWidth = 2,
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

    const currentIcon: IconMap | undefined = useMemo(() => {
        if (selection && selection.icons) {
            return selection.icons
                .map((i: any) => ({
                    name: i.properties.name,
                    content: i.icon.content,
                }))
                .find((i: IconMap) => i.name === icon);
        }
        return undefined;
    }, [icon]);

    // Process the SVG content to add stroke properties
    const processedContent = useMemo(() => {
        if (!currentIcon?.content) return '';

        // Add stroke properties to the SVG content
        let processed = currentIcon.content;

        // Add stroke and strokeWidth to all SVG elements
        processed = processed.replace(
            /<(path|circle|rect|ellipse|line|polyline|polygon)([^>]*?)\/>/g,
            `<$1$2 stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`,
        );

        return processed;
    }, [currentIcon?.content, strokeWidth]);

    return (
        <SvgIcon
            viewBox="0 0 24 24"
            className={className}
            sx={{
                width: sizeNumber,
                height: sizeNumber,
                ...sx,
            }}
            {...props}
        >
            {processedContent ? (
                <g dangerouslySetInnerHTML={{ __html: processedContent }} />
            ) : null}
        </SvgIcon>
    );
}
