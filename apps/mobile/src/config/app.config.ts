/**
 * =================================================================
 * APP CONFIGURATION
 * =================================================================
 *
 * Central configuration for the app.
 * Update these values when rebranding or deploying to different environments.
 *
 * For environment-specific values, use EXPO_PUBLIC_ prefixed env vars.
 * These can be accessed via process.env.EXPO_PUBLIC_* at build time.
 */

// ==================== APP INFO ====================
// Update these for rebranding

export const appInfo = {
    /** App display name */
    name: 'Mobile App',

    /** App version (should match app.config.ts) */
    version: '1.0.0',

    /** App description */
    description: 'A mobile app template for the monorepo',

    /** Bundle ID (for reference, actual value in app.config.ts) */
    bundleId: 'com.yourcompany.mobileapp',
} as const;
// ==================== FEATURE FLAGS ====================
// Toggle features on/off

export const features = {
    /** Enable onboarding screens for new users */
    enableOnboarding: true,

    /** Enable biometric authentication (fingerprint/face) */
    enableBiometrics: false,

    /** Enable push notifications */
    requiredLogin: false,

    /** Enable push notifications */
    enablePushNotifications: false,

    /** Enable dark mode */
    enableDarkMode: true,

    /** Enable analytics/tracking */
    enableAnalytics: false,

    /** Development mode (enables debug features) */
    isDevelopment: __DEV__,
} as const;

// ==================== AUTH CONFIGURATION ====================

export const authConfig = {
    /** Token refresh threshold (refresh when less than this time remains) */
    tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes

    /** Session timeout (in milliseconds) */
    sessionTimeout: 30 * 60 * 1000, // 30 minutes

    /** Remember device period (for MFA skip) */
    rememberDeviceDays: 30,
} as const;

// ==================== STORAGE KEYS ====================

export const storageKeys = {
    /** Has user completed onboarding */
    onboardingComplete: '@app/onboarding_complete',

    /** User preferences */
    userPreferences: '@app/user_preferences',

    /** Theme preference */
    themePreference: '@app/theme_preference',
} as const;

// ==================== COMBINED CONFIG ====================

export const appConfig = {
    app: appInfo,
    features,
    auth: authConfig,
    storageKeys,
} as const;

export default appConfig;
