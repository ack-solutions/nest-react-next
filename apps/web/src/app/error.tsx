'use client';

import { useEffect } from 'react';
import { Container } from '@web/components/ui/container';
import { Typography } from '@web/components/ui/typography';
import { Button } from '@web/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-error-lighter/30 to-white flex items-center justify-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-error-lighter/50 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-grey-200/50 rounded-full blur-3xl" />
            </div>

            <Container>
                <div className="relative text-center py-16 max-w-lg mx-auto">
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-error/10 flex items-center justify-center">
                        <AlertTriangle className="w-10 h-10 text-error" />
                    </div>

                    {/* Content */}
                    <Typography variant="h1" className="mb-4">
                        Something went wrong
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text-secondary"
                        className="mb-8 text-lg"
                    >
                        We apologize for the inconvenience. An unexpected error occurred
                        while processing your request.
                    </Typography>

                    {/* Error Details (Development only) */}
                    {process.env.NODE_ENV === 'development' && error.message && (
                        <div className="mb-8 p-4 bg-grey-100 rounded-xl text-left">
                            <Typography variant="caption" className="font-mono text-error break-all">
                                {error.message}
                            </Typography>
                            {error.digest && (
                                <Typography variant="caption" color="text-secondary" className="mt-2 block">
                                    Error ID: {error.digest}
                                </Typography>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            variant="contained"
                            size="lg"
                            onClick={reset}
                            leftIcon={<RefreshCw className="w-5 h-5" />}
                        >
                            Try Again
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            href="/"
                            leftIcon={<Home className="w-5 h-5" />}
                        >
                            Back to Home
                        </Button>
                    </div>

                    {/* Support Link */}
                    <Typography variant="body2" color="text-secondary" className="mt-8">
                        If the problem persists, please{' '}
                        <a
                            href="/contact"
                            className="text-primary hover:text-primary-dark font-medium transition-colors"
                        >
                            contact support
                        </a>
                    </Typography>
                </div>
            </Container>
        </div>
    );
}
