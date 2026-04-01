/**
 * React-specific configuration for client-side applications
 * Handles environment variables, app metadata, and runtime settings
 */

// Environment variables (Vite-compatible)
export const getEnvironmentConfig = () => {
    // Check if we're in a browser environment
    const isBrowser = typeof window !== 'undefined';

    if (isBrowser) {
        // Use import.meta.env for Vite applications
        return {
            version: import.meta.env?.VITE_REACT_APP_VERSION || '0.0.0',
            nodeEnv: import.meta.env?.MODE || 'development',
            isDevelopment: import.meta.env?.DEV || false,
            isProduction: import.meta.env?.PROD || false,
        };
    }

    // Fallback for SSR or other environments
    return {
        version: '0.0.0',
        nodeEnv: 'development',
        isDevelopment: true,
        isProduction: false,
    };
};

// App metadata configuration
export const getAppMetadata = () => {
    const envConfig = getEnvironmentConfig();

    return {
        version: envConfig.version,
        buildTime: new Date().toISOString(),
        environment: envConfig.nodeEnv,
        isDevelopment: envConfig.isDevelopment,
        isProduction: envConfig.isProduction,
    };
};

// Runtime configuration for React apps
export const getReactConfig = () => {
    const metadata = getAppMetadata();

    return {
        // App metadata
        app: {
            version: metadata.version,
            buildTime: metadata.buildTime,
            environment: metadata.environment,
            isDevelopment: metadata.isDevelopment,
            isProduction: metadata.isProduction,
        },

        // Feature flags (can be extended)
        features: {
            enableDevTools: metadata.isDevelopment,
            enableAnalytics: metadata.isProduction,
            enableErrorReporting: metadata.isProduction,
        },

        // UI configuration
        ui: {
            showVersion: true,
            showBuildInfo: metadata.isDevelopment,
        },
    };
};

// Type definitions
export type EnvironmentConfig = ReturnType<typeof getEnvironmentConfig>;
export type AppMetadata = ReturnType<typeof getAppMetadata>;
export type ReactConfig = ReturnType<typeof getReactConfig>;
