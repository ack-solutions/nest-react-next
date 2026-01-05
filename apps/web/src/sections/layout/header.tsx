'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@libs/react-shared';

interface HeaderProps {
    className?: string;
    children?: React.ReactNode;
}

interface NavItem {
    name: string;
    path: string;
    highlighted?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
    className,
    children,
}) => {
    const pathname = usePathname();
    const { isAuthenticated, currentUser, logout, authUser } = useAuth();
    return (
        <header>

            {children}
        </header>
    );
};
