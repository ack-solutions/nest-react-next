import React from 'react';
import { cn } from '../../utils/cn';
import { LucideIcon } from 'lucide-react';
import { tv, type VariantProps } from 'tailwind-variants';

const iconVariants = tv({
    base: [
        'inline-block',
    ],
    variants: {
        size: {
            xs: 'w-3 h-3',
            sm: 'w-4 h-4',
            md: 'w-5 h-5',
            lg: 'w-6 h-6',
            xl: 'w-8 h-8',
        },
        color: {
            primary: 'text-primary',
            secondary: 'text-secondary',
            ternary: 'text-ternary',
            success: 'text-success',
            error: 'text-error',
            warning: 'text-warning',
            info: 'text-info',
            grey: 'text-grey',
            current: 'text-current',
            'text-secondary': 'text-text-secondary',
            white: 'text-white',
        } as const,
    },
    defaultVariants: {
        size: 'md',
        color: 'current',
    },
});

export interface IconProps extends Omit<VariantProps<typeof iconVariants>, 'size'> {
    icon: LucideIcon;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
    className?: string;
    strokeWidth?: number;
    fill?: string;
}

export const Icon: React.FC<IconProps> = ({
    icon: IconComponent,
    size = 'md',
    color = 'current',
    className,
    strokeWidth = 1.50,
    fill = 'none',
}) => {
    const isCustomSize = typeof size === 'number';

    const iconClasses = cn(
        isCustomSize ? `w-${size} h-${size}` : iconVariants({
            size: size as any,
            color,
        }),
        className,
    );

    return (
        <IconComponent
            className={iconClasses}
            strokeWidth={strokeWidth}
            fill={fill}
        />
    );
};
