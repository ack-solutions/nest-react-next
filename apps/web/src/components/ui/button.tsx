import React from 'react';
import { cn } from '../../utils/cn';
import Link, { LinkProps } from 'next/link';
import { tv, type VariantProps } from 'tailwind-variants';

const buttonVariants = tv({
    base: [
        'inline-flex items-center justify-center gap-2',
        'transition-all duration-200 cursor-pointer',
        'focus:outline-hidden',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'rounded-lg',
        'border border-transparent', // ✅ Always have border!
        'min-w-[64px]',
        'active:scale-95', //  scale animation
        'font-medium', //  typography
    ],
    variants: {
        variant: {
            contained: '',
            outline: 'border-primary text-primary bg-transparent hover:bg-primary/10',
            ghost: 'bg-transparent hover:bg-opacity-10',
            text: 'bg-transparent hover:bg-opacity-10',
        },
        color: {
            primary: '',
            secondary: '',
            success: '',
            warning: '',
            info: '',
            danger: '',
            grey: '',
            gradient: '',
        },
        size: {
            xs: 'px-2.5 py-1 text-xs h-6',
            sm: 'px-3 py-1.5 text-sm h-8',
            md: 'px-4 py-2 text-md h-10',
            lg: 'px-6 py-3 text-base h-12',
            xl: 'px-8 py-4 text-lg h-14 rounded-lg',
        },
        fullWidth: {
            true: 'w-full',
        },
        iconOnly: {
            true: 'p-0 aspect-square min-w-0',
        },
    },
    compoundVariants: [
        // Primary variants (uses CSS variable --color-primary)
        {
            variant: 'contained',
            color: 'primary',
            class: 'bg-primary text-white hover:bg-primary-dark active:scale-95 focus:ring-primary/20 shadow-lg shadow-black/25 hover:shadow-xl hover:shadow-black/35',
        },
        {
            variant: 'outline',
            color: 'primary',
            class: 'border-primary text-primary hover:bg-gray-50 active:scale-95 focus:ring-primary/20 shadow-sm hover:shadow-md',
        },
        {
            variant: 'ghost',
            color: 'primary',
            class: 'text-text-primary hover:bg-gray-50 active:scale-95 hover:text-primary focus:ring-primary/20',
        },
        {
            variant: 'text',
            color: 'primary',
            class: 'text-text-primary hover:bg-gray-50 active:scale-95 hover:text-primary focus:ring-primary/20',
        },
        {
            variant: 'contained',
            color: 'gradient',
            class: 'border-none bg-(image:--gradient) text-white hover:bg-gradient active:scale-95',
        },
        // Secondary variants
        {
            variant: 'contained',
            color: 'secondary',
            class: 'bg-secondary text-secondary-contrast hover:bg-secondary-dark active:bg-secondary-dark focus:ring-secondary/20',
        },
        {
            variant: 'outline',
            color: 'secondary',
            class: 'border-secondary text-secondary hover:bg-secondary/10 focus:ring-secondary/20',
        },
        {
            variant: 'ghost',
            color: 'secondary',
            class: 'text-secondary hover:bg-secondary/10 focus:ring-secondary/20',
        },
        {
            variant: 'text',
            color: 'secondary',
            class: 'text-secondary hover:bg-secondary/10 focus:ring-secondary/20',
        },
        // Success variants
        {
            variant: 'contained',
            color: 'success',
            class: 'bg-success text-success-contrast hover:bg-success-dark active:bg-success-dark focus:ring-success/20',
        },
        {
            variant: 'outline',
            color: 'success',
            class: 'border-success text-success hover:bg-success/10 focus:ring-success/20',
        },
        {
            variant: 'ghost',
            color: 'success',
            class: 'text-success hover:bg-success/10 focus:ring-success/20',
        },
        {
            variant: 'text',
            color: 'success',
            class: 'text-success hover:bg-success/10 focus:ring-success/20',
        },
        // Warning variants
        {
            variant: 'contained',
            color: 'warning',
            class: 'bg-warning text-warning-contrast hover:bg-warning-dark active:bg-warning-dark focus:ring-warning/20',
        },
        {
            variant: 'outline',
            color: 'warning',
            class: 'border-warning text-warning hover:bg-warning/10 focus:ring-warning/20',
        },
        {
            variant: 'ghost',
            color: 'warning',
            class: 'text-warning hover:bg-warning/10 focus:ring-warning/20',
        },
        {
            variant: 'text',
            color: 'warning',
            class: 'text-warning hover:bg-warning/10 focus:ring-warning/20',
        },
        // Danger variants
        {
            variant: 'contained',
            color: 'danger',
            class: 'bg-error text-error-contrast hover:bg-error-dark active:bg-error-dark focus:ring-error/20',
        },
        {
            variant: 'outline',
            color: 'danger',
            class: 'border-error text-error hover:bg-error/10 focus:ring-error/20',
        },
        {
            variant: 'ghost',
            color: 'danger',
            class: 'text-error hover:bg-error/10 focus:ring-error/20',
        },
        {
            variant: 'text',
            color: 'danger',
            class: 'text-error hover:bg-error/10 focus:ring-error/20',
        },
        // Grey variants
        {
            variant: 'contained',
            color: 'grey',
            class: 'bg-grey text-foreground hover:bg-grey-dark active:bg-grey-dark focus:ring-grey/20',
        },
        {
            variant: 'outline',
            color: 'grey',
            class: 'border-divider text-foreground hover:bg-grey/10 active:bg-grey/20 focus:ring-primary/20',
        },
        {
            variant: 'ghost',
            color: 'grey',
            class: 'text-foreground hover:bg-grey/10 active:bg-grey/20',
        },
        {
            variant: 'text',
            color: 'grey',
            class: 'text-foreground hover:bg-grey/10 active:bg-grey/20',
        },
        // Icon-only size adjustments
        {
            iconOnly: true,
            size: 'xs',
            class: 'w-6 h-6',
        },
        {
            iconOnly: true,
            size: 'sm',
            class: 'w-8 h-8',
        },
        {
            iconOnly: true,
            size: 'md',
            class: 'w-10 h-10',
        },
        {
            iconOnly: true,
            size: 'lg',
            class: 'w-12 h-12',
        },
        {
            iconOnly: true,
            size: 'xl',
            class: 'w-14 h-14',
        },
    ],
    defaultVariants: {
        variant: 'contained',
        color: 'primary',
        size: 'md',
    },
});

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>, Omit<Partial<LinkProps>, 'onClick' | 'onMouseEnter' | 'onTouchStart'>, VariantProps<typeof buttonVariants> {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    loading?: boolean;
    component?: React.ElementType;
    target?: '_blank' | '_self' | '_parent' | '_top';
}

export const Button = ({
    variant = 'contained',
    color = 'primary',
    size = 'md',
    fullWidth = false,
    iconOnly = false,
    leftIcon,
    rightIcon,
    loading = false,
    className,
    children,
    disabled,
    component,
    ...props
}: ButtonProps) => {
    const Component = component || (props?.href ? Link : 'button');

    return (
        <Component
            className={cn(
                buttonVariants({
                    variant,
                    color: color as any,
                    size,
                    fullWidth,
                    iconOnly,
                }),
                className,
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            ) : iconOnly ? (
                // Icon only mode - no spacing, just render the icon
                leftIcon || children
            ) : (
                <>
                    {leftIcon && <>{leftIcon}</>}
                    {children}
                    {rightIcon && <>{rightIcon}</>}
                </>
            )}
        </Component>
    );
};

// Icon-only button variant
export const IconButton: React.FC<
    Omit<ButtonProps, 'children'> & {
        icon: React.ReactNode;
    }
> = ({ icon, className, ...props }) => {
    return (
        <Button
            iconOnly
            className={cn(className)}
            {...props}
        >
            {icon}
        </Button>
    );
};
