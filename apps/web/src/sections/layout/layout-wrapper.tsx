'use client';

import React, { ReactNode } from 'react';
import { Header } from './header';
import { useLayout } from '@web/contexts/layout-context';
import { useRouteLayout } from '@web/hooks/use-route-layout';
import { Footer } from './footer';
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
        <>
            <Header />
            <main className={cn('flex-1', className)}>
                {children}
            </main>
            <Footer />
        </>
    );
}
