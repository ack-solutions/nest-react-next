/**
 * =================================================================
 * SHARED AUTH CONFIGURATION
 * =================================================================
 *
 * Configures the auth client using the shared package and local storage adapter.
 */

import { AuthClient, createAxiosAdapter } from '@ackplus/nest-auth-client';
import { SecureStorageAdapter } from './storage-adapter';
import { config, instanceApi } from '@libs/react-shared';
// Use the existing mobile api client's axios instance

export const authClient = new AuthClient({
    baseUrl: config.apiUrl + '/api',
    accessTokenType: 'header',
    storage: new SecureStorageAdapter(),
    httpAdapter: createAxiosAdapter(instanceApi),
});

export default authClient;
