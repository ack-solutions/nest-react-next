import type { AppConfig, RuntimeConfig } from './app-config.generated';
import { appConfig, runtimeConfig } from './app-config.generated';

/**
 * Returns the strongly typed configuration object generated from config/app.yml.
 */
export const getAppConfig = (): AppConfig => appConfig;

/**
 * Returns the subset of configuration intended for client-side consumption.
 */
export const getRuntimeConfig = (): RuntimeConfig => runtimeConfig;

/**
 * Safe helper to read a nested configuration value using dot notation.
 */
export const getConfigValue = <T = unknown>(key: string, fallback?: T): T => {
    const segments = key.split('.').filter(Boolean);
    let cursor: any = appConfig;

    for (const segment of segments) {
        if (cursor && typeof cursor === 'object' && segment in cursor) {
            cursor = cursor[segment];
            continue;
        }

        return fallback as T;
    }

    return cursor as T;
};

export type { AppConfig, RuntimeConfig };
export { appConfig, runtimeConfig };
