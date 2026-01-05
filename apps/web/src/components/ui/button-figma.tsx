'use client';

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    children?: React.ReactNode;
}

export const ButtonFigma: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'medium',
    icon,
    iconPosition = 'left',
    children,
    className = '',
    disabled = false,
    ...props
}) => {
    const baseStyles =
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
        primary:
            'bg-[#1A1A1A] text-white hover:bg-[#000000] active:scale-95 shadow-lg shadow-black/25 hover:shadow-xl hover:shadow-black/35',
        secondary:
            'bg-white text-text-primary hover:bg-gray-50 active:scale-95 border border-(--border-subtle) hover:border-[#1A1A1A] shadow-sm hover:shadow-md',
        ghost: 'text-text-primary hover:bg-gray-50 active:scale-95 hover:text-[#1A1A1A]',
    };

    const sizeStyles = {
        small: 'px-3 py-1.5 text-sm',
        medium: 'px-5 py-2.5',
        large: 'px-7 py-3.5',
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {icon && iconPosition === 'left' && <span className="inline-flex">{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className="inline-flex">{icon}</span>}
        </button>
    );
};
