export const authConfig = {
    baseUrl: `${process.env.NEXT_PUBLIC_APP_API_URL || 'http://localhost:3333'}/api`,
    accessTokenType: 'cookie' as const,
    cookieNames: {
        accessToken: 'accessToken',      // Changed from 'nest_auth_access_token'
        refreshToken: 'refreshToken',    // Changed from 'nest_auth_refresh_token'
    },
    debug: false,
};