import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage adapter for AuthClient
 * Implements the interface expected by @ackplus/nest-auth-client
 *
 * Uses SecureStore for tokens and AsyncStorage for other data.
 */
export class SecureStorageAdapter {
    async getItem(key: string): Promise<string | null> {
        // Use SecureStore for sensitive token data
        if (key.includes('token') || key.includes('refresh') || key.includes('auth')) {
            return SecureStore.getItemAsync(key);
        }
        return AsyncStorage.getItem(key);
    }

    async setItem(key: string, value: string): Promise<void> {
        if (key.includes('token') || key.includes('refresh') || key.includes('auth')) {
            await SecureStore.setItemAsync(key, value);
        } else {
            await AsyncStorage.setItem(key, value);
        }
    }

    async removeItem(key: string): Promise<void> {
        if (key.includes('token') || key.includes('refresh') || key.includes('auth')) {
            await SecureStore.deleteItemAsync(key);
        } else {
            await AsyncStorage.removeItem(key);
        }
    }

    get(key: string) {
        return this.getItem(key);
    }

    set(key: string, value: string) {
        return this.setItem(key, value);
    }

    remove(key: string) {
        return this.removeItem(key);
    }

    clear() {
        return AsyncStorage.clear();
    }
}
