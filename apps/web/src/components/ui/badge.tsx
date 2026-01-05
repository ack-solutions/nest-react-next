import React from 'react';
import { cn } from '../../utils/cn';
import { tv, type VariantProps } from 'tailwind-variants';

const badgeVariants = tv({
    base: [
        'inline-flex items-center justify-center gap-1',
        'px-2 py-0.5',
        'text-xs font-medium',
        'rounded-full',
        'transition-colors duration-200',
    ],
    variants: {
        variant: {
            default: 'bg-gray-100 text-gray-800',
            primary: 'bg-primary/10 text-primary-dark',
            secondary: 'bg-secondary/10 text-secondary-dark',
            success: 'bg-success/10 text-success-dark',
            warning: 'bg-warning/10 text-warning-dark',
            error: 'bg-error/10 text-error-dark',
            info: 'bg-info/10 text-info-dark',
        },
        size: {
            sm: 'px-1.5 py-0.5 text-xs',
            md: 'px-2 py-0.5 text-xs',
            lg: 'px-2.5 py-1 text-sm',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'md',
    },
});

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
    icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
    variant,
    size,
    icon,
    className,
    children,
    ...props
}) => {
    return (
        <span
            className={cn(badgeVariants({ variant, size }), className)}
            {...props}
        >
            {icon && <span className="inline-flex">{icon}</span>}
            {children}
        </span>
    );
};
