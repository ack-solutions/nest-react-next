// lib/auth.ts
'use client';

import { AuthClient } from '@ackplus/nest-auth-client';
import { authConfig } from './auth-config';

/**
 * Create Auth Client for client-side usage
 */
export const authClient = new AuthClient(authConfig);