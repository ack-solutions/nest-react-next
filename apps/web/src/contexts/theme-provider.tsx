'use client';

import React, { useEffect } from 'react';
import { generateCSSVariables } from '@web/config/tokens';

interface ThemeProviderProps {
    children: React.ReactNode;
}

/**
 * ThemeProvider Component
 * Injects CSS variables from tokens.ts into the document root
 * This ensures the CSS variables from the single source of truth are available
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
    useEffect(() => {
        // Generate and inject CSS variables
        const cssVariables = generateCSSVariables();

        // Create or update style element
        let styleElement = document.getElementById('theme-variables');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'theme-variables';
            document.head.appendChild(styleElement);
        }

        styleElement.textContent = `:root { ${cssVariables} }`;

        // Cleanup on unmount
        return () => {
            if (styleElement && styleElement.parentNode) {
                styleElement.parentNode.removeChild(styleElement);
            }
        };
    }, []);

    return <>{children}</>;
}

export default ThemeProvider;
