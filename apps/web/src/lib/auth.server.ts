// lib/auth.server.ts
// NO 'use client' directive - server only

import { createNextAuthHelpers } from '@ackplus/nest-auth-react';
import { authConfig } from '@web/lib/auth-config';

// For server-side, you might want to use the internal API URL
const serverApiUrl = process.env.SERVER_APP_API_URL || process.env.NEXT_PUBLIC_APP_API_URL || 'http://localhost:3333';
const serverConfig = {
    ...authConfig,
    baseUrl: `${serverApiUrl}/api`,
};

export const { getServerAuth, withAuth: withServerAuth, createInitialState } = createNextAuthHelpers(serverConfig);