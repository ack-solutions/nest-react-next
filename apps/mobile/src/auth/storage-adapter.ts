import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseStorageAdapter } from '@libs/utils';

/**
 * Storage adapter for React Native
 * Extends BaseStorageAdapter from @repo/utils for consistent interface
 *
 * Uses SecureStore for sensitive tokens and AsyncStorage for other data.
 */
export class SecureStorageAdapter extends BaseStorageAdapter {
    /**
     * Check if a key should use secure storage
     */
    private isSecureKey(key: string): boolean {
        return key.includes('token') || key.includes('refresh') || key.includes('auth');
    }

    async getItem(key: string): Promise<string | null> {
        // Use SecureStore for sensitive token data
        if (this.isSecureKey(key)) {
            return SecureStore.getItemAsync(key);
        }
        return AsyncStorage.getItem(key);
    }

    async setItem(key: string, value: string): Promise<void> {
        if (this.isSecureKey(key)) {
            await SecureStore.setItemAsync(key, value);
        } else {
            await AsyncStorage.setItem(key, value);
        }
    }

    async removeItem(key: string): Promise<void> {
        if (this.isSecureKey(key)) {
            await SecureStore.deleteItemAsync(key);
        } else {
            await AsyncStorage.removeItem(key);
        }
    }

    async hasItem(key: string): Promise<boolean> {
        if (this.isSecureKey(key)) {
            return SecureStore.getItemAsync(key).then(item => item !== null);
        }
        return AsyncStorage.getItem(key).then(item => item !== null);
    }

    override async clear(): Promise<void> {
        await AsyncStorage.clear();
    }
}

/**
 * AsyncStorage adapter for React Native (non-secure data)
 * Use this for general-purpose storage like cart, location, etc.
 */
export class AsyncStorageAdapter extends BaseStorageAdapter {
    async getItem(key: string): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(key);
        } catch (error) {
            console.error('AsyncStorageAdapter.getItem error:', error);
            return null;
        }
    }

    async setItem(key: string, value: string): Promise<void> {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.error('AsyncStorageAdapter.setItem error:', error);
        }
    }

    async removeItem(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('AsyncStorageAdapter.removeItem error:', error);
        }
    }

    async hasItem(key: string): Promise<boolean> {
        try {
            const item = await AsyncStorage.getItem(key);
            return item !== null;
        } catch (error) {
            console.error('AsyncStorageAdapter.hasItem error:', error);
            return false;
        }
    }

    override async clear(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error('AsyncStorageAdapter.clear error:', error);
        }
    }
}
