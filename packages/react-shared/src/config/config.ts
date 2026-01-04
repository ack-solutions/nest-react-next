export const config = {
    apiUrl: ((import.meta as any).env && (import.meta as any).env.VITE_API_URL) ||
        process.env.NEXT_PUBLIC_APP_API_URL,
    frontUrl: ((import.meta as any).env && (import.meta as any).env.VITE_FRONT_URL) ||
        process.env.NEXT_PUBLIC_APP_FRONT_URL,
    adminUrl: ((import.meta as any).env && (import.meta as any).env.VITE_ADMIN_URL) ||
        process.env.NEXT_PUBLIC_APP_ADMIN_URL,
    version: ((import.meta as any).env && (import.meta as any).env.VITE_VERSION) ||
        process.env.NEXT_PUBLIC_APP_VERSION,
};
