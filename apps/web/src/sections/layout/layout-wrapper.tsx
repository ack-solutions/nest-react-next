'use client';

import React, { ReactNode } from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { useLayout } from '@web/contexts/layout-context';
import { useRouteLayout } from '@web/hooks/use-route-layout';
import { cn } from '@web/utils/cn';

interface LayoutWrapperProps {
    children: ReactNode;
    className?: string;
}

export function LayoutWrapper({ children, className }: LayoutWrapperProps) {
    const { settings } = useLayout();

    // This hook automatically manages layout settings based on current route
    useRouteLayout();

    return (
        <div className="min-h-screen flex flex-col">
            {settings.showHeader && <Header />}
            <main className={cn('flex-1', settings.layoutClass, className)}>
                {children}
            </main>
            {settings.showFooter && <Footer />}
        </div>
    );
}
