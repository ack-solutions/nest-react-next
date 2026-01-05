import React from 'react';
import { Typography } from './typography';

interface AuthLoadingProps {
    message?: string;
    className?: string;
}

export const AuthLoading: React.FC<AuthLoadingProps> = ({
    message = 'Loading...',
    className = ''
}) => {
    return (
        <div className={`flex items-center justify-center min-h-screen bg-background ${className}`}>
            <div className="flex flex-col items-center gap-4 max-w-sm mx-auto px-6">
                <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20"></div>
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-primary absolute top-0 left-0"></div>
                </div>
                <Typography
                    variant="body2"
                    color="text-secondary"
                    className="text-center"
                >
                    {message}
                </Typography>
            </div>
        </div>
    );
};
