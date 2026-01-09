/**
 * =================================================================
 * CONSTANTS
 * =================================================================
 *
 * App-wide constants for easy access.
 * Re-exports theme tokens and adds additional constants.
 */

// Re-export theme tokens
export { colors, spacing, borderRadius, typography, shadows } from '../theme/tokens';

// ==================== LAYOUT ====================

export const layout = {
    screenPadding: 16,
    cardPadding: 16,
    inputHeight: 48,
    buttonHeight: 48,
    headerHeight: 56,
    tabBarHeight: 64,
} as const;

// ==================== ANIMATION ====================

export const animation = {
    fast: 150,
    normal: 300,
    slow: 500,
} as const;

// ==================== Z-INDEX ====================

export const zIndex = {
    base: 0,
    dropdown: 100,
    sticky: 200,
    modal: 300,
    toast: 400,
} as const;
