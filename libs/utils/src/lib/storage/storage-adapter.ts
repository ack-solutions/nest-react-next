/**
 * =================================================================
 * STORAGE ADAPTER - CROSS-PLATFORM STORAGE ABSTRACTION
 * =================================================================
 *
 * A unified storage interface that works across:
 * - Web (localStorage)
 * - React Native (AsyncStorage)
 * - React Native Secure (expo-secure-store)
 *
 * Usage:
 * - Web: Use LocalStorageAdapter (default)
 * - Mobile: Extend BaseStorageAdapter or implement IStorageAdapter
 */

/**
 * Storage adapter interface for cross-platform support.
 * All methods can return either sync or async values.
 */
export interface IStorageAdapter {
    getItem: (key: string) => Promise<string | null> | string | null;
    setItem: (key: string, value: string) => Promise<void> | void;
    removeItem: (key: string) => Promise<void> | void;
    hasItem: (key: string) => Promise<boolean> | boolean;
    clear?: () => Promise<void> | void;
}

/**
 * Abstract base class for storage adapters.
 * Provides common utility methods and can be extended for specific platforms.
 */
export abstract class BaseStorageAdapter implements IStorageAdapter {
    /**
     * Get an item from storage.
     */
    abstract getItem(key: string): Promise<string | null> | string | null;

    /**
     * Set an item in storage.
     */
    abstract setItem(key: string, value: string): Promise<void> | void;

    /**
     * Remove an item from storage.
     */
    abstract removeItem(key: string): Promise<void> | void;

    /**
     * Check if an item exists in storage.
     */
    abstract hasItem(key: string): Promise<boolean> | boolean;

    /**
     * Clear all items from storage (optional).
     */
    clear?(): Promise<void> | void;

    /**
     * Alias for getItem (for compatibility).
     */
    get(key: string): Promise<string | null> | string | null {
        return this.getItem(key);
    }

    /**
     * Alias for setItem (for compatibility).
     */
    set(key: string, value: string): Promise<void> | void {
        return this.setItem(key, value);
    }

    /**
     * Alias for removeItem (for compatibility).
     */
    remove(key: string): Promise<void> | void {
        return this.removeItem(key);
    }

    /**
     * Get a JSON parsed value from storage.
     */
    async getJSON<T>(key: string): Promise<T | null> {
        try {
            const value = await this.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`StorageAdapter.getJSON error for key "${key}":`, error);
            return null;
        }
    }

    /**
     * Set a JSON stringified value in storage.
     */
    async setJSON<T>(key: string, value: T): Promise<void> {
        try {
            await this.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`StorageAdapter.setJSON error for key "${key}":`, error);
        }
    }
}

/**
 * localStorage adapter for web browsers.
 * Automatically handles SSR (server-side rendering) by checking for window.
 */
export class LocalStorageAdapter extends BaseStorageAdapter {
    private isAvailable(): boolean {
        return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    }

    getItem(key: string): string | null {
        if (!this.isAvailable()) return null;
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error(`LocalStorageAdapter.getItem error for key "${key}":`, error);
            return null;
        }
    }

    setItem(key: string, value: string): void {
        if (!this.isAvailable()) return;
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error(`LocalStorageAdapter.setItem error for key "${key}":`, error);
        }
    }

    removeItem(key: string): void {
        if (!this.isAvailable()) return;
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`LocalStorageAdapter.removeItem error for key "${key}":`, error);
        }
    }

    hasItem(key: string): boolean {
        if (!this.isAvailable()) return false;
        try {
            return localStorage.getItem(key) !== null;
        } catch (error) {
            console.error(`LocalStorageAdapter.hasItem error for key "${key}":`, error);
            return false;
        }
    }

    override clear(): void {
        if (!this.isAvailable()) return;
        try {
            localStorage.clear();
        } catch (error) {
            console.error('LocalStorageAdapter.clear error:', error);
        }
    }
}

/**
 * In-memory storage adapter for testing or SSR fallback.
 */
export class MemoryStorageAdapter extends BaseStorageAdapter {
    private storage: Map<string, string> = new Map();

    getItem(key: string): string | null {
        return this.storage.get(key) ?? null;
    }

    setItem(key: string, value: string): void {
        this.storage.set(key, value);
    }

    removeItem(key: string): void {
        this.storage.delete(key);
    }

    hasItem(key: string): boolean {
        return this.storage.has(key);
    }

    override clear(): void {
        this.storage.clear();
    }
}

/**
 * Default storage adapter instance for web.
 * Use this as the default in contexts/providers.
 */
export const defaultStorageAdapter: IStorageAdapter = new LocalStorageAdapter();

/**
 * Create a storage adapter based on environment.
 * This is a factory function that returns the appropriate adapter.
 */
export function createStorageAdapter(): IStorageAdapter {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        return new LocalStorageAdapter();
    }
    // Fallback to memory storage for SSR or non-browser environments
    return new MemoryStorageAdapter();
}
