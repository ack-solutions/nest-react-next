import { registerAs } from '@nestjs/config';


export default registerAs('nest_auth', () => ({
    adminUIsecretKey: process.env.NEST_AUTH_ADMINUI_SECRET_KEY,
    mfaEnabled: process.env.NEST_AUTH_MFA_ENABLED === 'true'
}));
