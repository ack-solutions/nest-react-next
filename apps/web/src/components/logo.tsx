'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@web/utils/cn';
import { siteConfig } from '@web/config';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'white';
    asLink?: boolean;
}

const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
};

export const Logo = ({
    className,
    size = 'md',
    variant = 'default',
    asLink = false,
}: LogoProps) => {
    // Text-based logo with gradient
    const logoContent = (
        <div
            className={cn(
                'flex items-center gap-2 font-bold',
                sizeClasses[size],
                variant === 'white' ? 'text-white' : '',
                className
            )}
        >
            {/* Logo Icon */}
            <div
                className={cn(
                    'flex items-center justify-center rounded-lg font-bold',
                    size === 'sm' && 'w-7 h-7 text-sm',
                    size === 'md' && 'w-9 h-9 text-base',
                    size === 'lg' && 'w-11 h-11 text-lg',
                    variant === 'white'
                        ? 'bg-white text-primary'
                        : 'bg-gradient-to-br from-primary to-secondary text-white'
                )}
            >
                {siteConfig.name.charAt(0)}
            </div>
            {/* Logo Text */}
            <span
                className={cn(
                    variant === 'white'
                        ? 'text-white'
                        : 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'
                )}
            >
                {siteConfig.name}
            </span>
        </div>
    );

    if (asLink) {
        return (
            <Link
                href="/"
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg inline-block"
            >
                {logoContent}
            </Link>
        );
    }

    return logoContent;
};

/**
 * Simple text logo
 */
export const LogoText = ({
    className,
    variant = 'default',
}: {
    className?: string;
    variant?: 'default' | 'gradient' | 'white';
}) => {
    return (
        <span
            className={cn(
                'font-bold text-xl',
                variant === 'gradient' && 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent',
                variant === 'white' && 'text-white',
                variant === 'default' && 'text-foreground',
                className
            )}
        >
            {siteConfig.name}
        </span>
    );
};
