import { registerAs } from '@nestjs/config';

export interface INestAuthEnvConfig {
    jwtSecret: string;
    adminUIsecretKey: string;
    trustedDevicesSecret: string;
    cookiesDomain: string;
}
export default registerAs('nest_auth', () => ({
    jwtSecret: process.env.NEST_AUTH_JWT_SECRET,
    adminUIsecretKey: process.env.NEST_AUTH_ADMINUI_SECRET_KEY,
    trustedDevicesSecret: process.env.NEST_AUTH_TRUSTED_DEVICES_SECRET,
    cookiesDomain: process.env.NEST_AUTH_COOKIES_DOMAIN,
}));
