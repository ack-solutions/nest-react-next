export function getEnv(key: string, defaultValue: any = null) {
    return process.env[key] || defaultValue;
}
