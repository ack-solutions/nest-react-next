/**
 * =================================================================
 * SHARED AUTH CONFIGURATION
 * =================================================================
 *
 * Configures the auth client using the shared package and local storage adapter.
 */

import { AuthClient, createAxiosAdapter } from '@ackplus/nest-auth-client';
import { AsyncStorageAdapter, SecureStorageAdapter } from './storage-adapter';
import { config, instanceApi } from '@libs/react-shared';
import { Platform } from 'react-native';
// Use the existing mobile api client's axios instance

export const secureStorageAdapter = new SecureStorageAdapter();
export const asyncStorageAdapter = new AsyncStorageAdapter();

export const authClient = new AuthClient({
    baseUrl: config.apiUrl + '/api',
    accessTokenType: 'header',
    storage: Platform.OS === 'web' ? asyncStorageAdapter : secureStorageAdapter,
    httpAdapter: createAxiosAdapter(instanceApi),
});

export default authClient;
