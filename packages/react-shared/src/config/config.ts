// Safely access process.env to avoid ReferenceError in environments where process is undefined (e.g. pure Vite without polyfill)
const getEnv = (key: string) => {
    if (typeof process !== 'undefined' && process.env) {
        return process.env[key];
    }
    return '';
};

export const config = {
    apiUrl: getEnv('VITE_API_URL') || getEnv('NEXT_PUBLIC_APP_API_URL') || getEnv('EXPO_PUBLIC_API_URL'),
    frontUrl: getEnv('VITE_FRONT_URL') || getEnv('NEXT_PUBLIC_APP_FRONT_URL') || getEnv('EXPO_PUBLIC_FRONT_URL'),
    adminUrl: getEnv('VITE_ADMIN_URL') || getEnv('NEXT_PUBLIC_APP_ADMIN_URL') || getEnv('EXPO_PUBLIC_ADMIN_URL'),
    version: getEnv('VITE_VERSION') || getEnv('NEXT_PUBLIC_APP_VERSION') || getEnv('EXPO_PUBLIC_VERSION'),
};
