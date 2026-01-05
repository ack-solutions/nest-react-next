'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Typography } from '@web/components/ui/typography';
import { Icon } from '@web/components/ui/icons';
import { cn } from '@web/utils/cn';

interface AuthErrorProps {
    message: string | null;
    className?: string;
}

export const AuthError: React.FC<AuthErrorProps> = ({ message, className }) => {
    if (!message) return null;

    return (
        <div
            className={cn(
                'flex items-start gap-3 rounded-xl border border-error/20 bg-error/5 p-4',
                className
            )}
            role="alert"
        >
            <Icon icon={AlertCircle} color="error" className="shrink-0 mt-0.5" />
            <Typography variant="body2" color="error" className="leading-snug">
                {message}
            </Typography>
        </div>
    );
};

interface AuthHeaderProps {
    title: string;
    subtitle?: string;
    className?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle, className }) => {
    return (
        <div className={cn('text-center mb-8', className)}>
            <Typography
                variant="h2"
                component="h1"
                color="text-primary"
                className="mb-2"
            >
                {title}
            </Typography>
            {subtitle && (
                <Typography variant="body2" color="text-secondary">
                    {subtitle}
                </Typography>
            )}
        </div>
    );
};

interface AuthDividerProps {
    text?: string;
    className?: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({
    text = 'or continue with',
    className
}) => {
    return (
        <div className={cn('relative my-6', className)}>
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-text-secondary">{text}</span>
            </div>
        </div>
    );
};

interface AuthLinkProps {
    text: string;
    linkText: string;
    href: string;
    className?: string;
}

export const AuthLink: React.FC<AuthLinkProps> = ({
    text,
    linkText,
    href,
    className
}) => {
    return (
        <div className={cn('mt-6 text-center', className)}>
            <Typography variant="body2" color="text-secondary">
                {text}{' '}
                <a
                    href={href}
                    className="text-primary font-medium hover:text-primary-dark transition-colors"
                >
                    {linkText}
                </a>
            </Typography>
        </div>
    );
};
