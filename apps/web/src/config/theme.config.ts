/**
 * Theme Configuration
 * Uses tokens from tokens.ts as the single source of truth
 */

import {
    colorTokens,
    typographyTokens,
    spacingTokens,
    radiusTokens,
    shadowTokens,
    transitionTokens,
    zIndexTokens,
    breakpointTokens,
    generateCSSVariables,
} from './tokens';

export const themeConfig = {
    colors: colorTokens,
    typography: typographyTokens,
    spacing: spacingTokens,
    borderRadius: radiusTokens,
    shadows: shadowTokens,
    transitions: transitionTokens,
    zIndex: zIndexTokens,
    breakpoints: breakpointTokens,
};

// Re-export tokens for direct access
export {
    colorTokens,
    typographyTokens,
    spacingTokens,
    radiusTokens,
    shadowTokens,
    transitionTokens,
    zIndexTokens,
    breakpointTokens,
    generateCSSVariables,
};

// Type exports for use in components
export type ThemeConfig = typeof themeConfig;
export type ThemeColors = typeof colorTokens;
export type ThemeTypography = typeof typographyTokens;

export default themeConfig;
