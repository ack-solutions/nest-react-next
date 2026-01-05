import React from 'react';
import Image from '../ui/image';
import { cn } from '@web/utils/cn';

interface LogoProps {
    className?: string;
    isDarkMode?: boolean;
}

export const Logo = ({ className }: LogoProps) => {
    return (
        <Image
            src="/images/logo.png"
            alt="Badacup Logo"
            className={cn(className, 'h-auto max-w-[100px]')}
        />
    );
};
