/**
 * =================================================================
 * STORAGE UTILITIES
 * =================================================================
 *
 * AsyncStorage helpers for non-sensitive data.
 * For sensitive data (tokens), use auth-storage.ts with SecureStore.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage utilities for general app data
 */
export const storage = {
    /**
     * Get an item from storage
     */
    async get<T = string>(key: string): Promise<T | null> {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value === null) return null;

            // Try to parse as JSON, fall back to raw string
            try {
                return JSON.parse(value) as T;
            } catch {
                return value as unknown as T;
            }
        } catch (error) {
            console.warn(`[Storage] Error getting ${key}:`, error);
            return null;
        }
    },

    /**
     * Set an item in storage
     */
    async set(key: string, value: any): Promise<void> {
        try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            await AsyncStorage.setItem(key, stringValue);
        } catch (error) {
            console.warn(`[Storage] Error setting ${key}:`, error);
        }
    },

    /**
     * Remove an item from storage
     */
    async remove(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.warn(`[Storage] Error removing ${key}:`, error);
        }
    },

    /**
     * Clear all storage
     * Use with caution!
     */
    async clear(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.warn('[Storage] Error clearing storage:', error);
        }
    },

    /**
     * Get all keys in storage
     */
    async getAllKeys(): Promise<readonly string[]> {
        try {
            return await AsyncStorage.getAllKeys();
        } catch (error) {
            console.warn('[Storage] Error getting all keys:', error);
            return [];
        }
    },

    /**
     * Get multiple items at once
     */
    async getMultiple<T = any>(keys: string[]): Promise<Record<string, T | null>> {
        try {
            const pairs = await AsyncStorage.multiGet(keys);
            const result: Record<string, T | null> = {};

            pairs.forEach(([key, value]) => {
                if (value === null) {
                    result[key] = null;
                } else {
                    try {
                        result[key] = JSON.parse(value) as T;
                    } catch {
                        result[key] = value as unknown as T;
                    }
                }
            });

            return result;
        } catch (error) {
            console.warn('[Storage] Error getting multiple items:', error);
            return {};
        }
    },
};

export default storage;
