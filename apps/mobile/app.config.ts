import { ExpoConfig, ConfigContext } from 'expo/config';

/**
 * =================================================================
 * APP CONFIGURATION - EASY REBRANDING
 * =================================================================
 *
 * To rebrand this app for a new project, update the following:
 *
 * 1. APP_NAME - Display name of the app
 * 2. APP_SLUG - URL-friendly name (lowercase, no spaces)
 * 3. APP_SCHEME - Deep linking scheme (e.g., myapp://)
 * 4. ANDROID_PACKAGE - Android package name (e.g., com.company.app)
 * 5. IOS_BUNDLE_ID - iOS bundle identifier (e.g., com.company.app)
 *
 * For icons and splash:
 * - Replace ./src/assets/images/icon.png
 * - Replace ./src/assets/images/splash.png
 * - Update SPLASH_BACKGROUND_COLOR to match your brand
 */

// ==================== REBRAND THESE VALUES ====================
const APP_NAME = 'Mobile App';
const APP_SLUG = 'mobile-app';
const APP_SCHEME = 'mobileapp';
const ANDROID_PACKAGE = 'com.yourcompany.mobileapp';
const IOS_BUNDLE_ID = 'com.yourcompany.mobileapp';
const SPLASH_BACKGROUND_COLOR = '#293b6b'; // Primary color from theme
// ==============================================================

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: APP_NAME,
    slug: APP_SLUG,
    version: '1.0.0',
    orientation: 'portrait',
    icon: './src/assets/images/icon.png',
    scheme: APP_SCHEME,
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,

    // Splash screen configuration
    splash: {
        image: './src/assets/images/splash.png',
        resizeMode: 'contain',
        backgroundColor: SPLASH_BACKGROUND_COLOR,
    },

    // iOS specific configuration
    ios: {
        supportsTablet: true,
        bundleIdentifier: IOS_BUNDLE_ID,
    },

    // Android specific configuration
    android: {
        adaptiveIcon: {
            foregroundImage: './src/assets/images/adaptive-icon.png',
            backgroundColor: SPLASH_BACKGROUND_COLOR,
        },
        package: ANDROID_PACKAGE,
    },

    // Web configuration
    web: {
        bundler: 'metro',
        output: 'static',
        favicon: './src/assets/images/favicon.png',
    },

    // Plugins
    plugins: [
        "expo-asset",
        'expo-router',
        'expo-secure-store',
        [
            'expo-splash-screen',
            {
                image: './src/assets/images/splash.png',
                imageWidth: 200,
                resizeMode: 'contain',
                backgroundColor: SPLASH_BACKGROUND_COLOR,
            },
        ],
    ],

    // Experiments
    experiments: {
        typedRoutes: true,
    },

    // Extra configuration (accessible via Constants.expoConfig.extra)
    extra: {
        // Environment variables can be accessed here
        API_URL: process.env.EXPO_PUBLIC_API_URL,
        eas: {
            projectId: 'your-project-id', // Replace with your EAS project ID
        },
    },
});
