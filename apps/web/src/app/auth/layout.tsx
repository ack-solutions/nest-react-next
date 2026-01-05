'use client';

import React, { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@web/components/ui/card';
import { Container } from '@web/components/ui/container';
import { Logo } from '@web/components/logo';
import { useLayout } from '@web/contexts/layout-context';

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    const { setHeaderVisibility, setFooterVisibility } = useLayout();

    // Hide header and footer on auth pages
    useEffect(() => {
        setHeaderVisibility(false);
        setFooterVisibility(false);

        return () => {
            setHeaderVisibility(true);
            setFooterVisibility(true);
        };
    }, [setHeaderVisibility, setFooterVisibility]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/20 flex flex-col">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200/30 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-100/20 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <header className="relative z-10 py-6">
                <Container>
                    <div className="flex items-center justify-center">
                        <Link href="/" className="inline-block">
                            <Logo className="h-10 md:h-12" />
                        </Link>
                    </div>
                </Container>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 flex items-center justify-center py-8 px-4">
                <div className="w-full max-w-md">
                    <Card
                        variant="glass"
                        className="rounded-2xl shadow-xl border border-white/50 overflow-hidden"
                        padding="none"
                    >
                        <CardContent className="p-6 md:p-8">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 py-6">
                <Container>
                    <p className="text-center text-sm text-text-secondary">
                        © {new Date().getFullYear()} Your Company. All rights reserved.
                    </p>
                </Container>
            </footer>
        </div>
    );
}
