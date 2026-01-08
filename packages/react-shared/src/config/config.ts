export const config = {
    apiUrl: process.env.VITE_API_URL || process.env.NEXT_PUBLIC_APP_API_URL || process.env.EXPO_PUBLIC_API_URL,
    frontUrl: process.env.VITE_FRONT_URL || process.env.NEXT_PUBLIC_APP_FRONT_URL || process.env.EXPO_PUBLIC_FRONT_URL,
    adminUrl: process.env.VITE_ADMIN_URL || process.env.NEXT_PUBLIC_APP_ADMIN_URL || process.env.EXPO_PUBLIC_ADMIN_URL,
    version: process.env.VITE_VERSION || process.env.NEXT_PUBLIC_APP_VERSION || process.env.EXPO_PUBLIC_VERSION,
};
