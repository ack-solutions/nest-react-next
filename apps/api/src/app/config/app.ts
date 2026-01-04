import { Injectable } from '@nestjs/common';
import { ConfigService, registerAs } from '@nestjs/config';


export interface IAppConfig {
    env: string;
    appUrl: string;
    frontUrl: string;
    appKey: string;
    port: number;
    defaultTenantName: string;
    adminSecretKey: string;
}


export default registerAs('app', () => ({
    env: process.env.APP_ENV || 'dev',
    appUrl: process.env.APP_URL || '',
    frontUrl: process.env.APP_FRONT_URL || '',
    appKey: process.env.APP_KEY || '',
    port: parseInt(process.env.PORT, 10) || 3333,
    adminSecretKey: process.env.NEST_APP_CONSOLE_SECRET_KEY || '',
    defaultTenantName: process.env.DEFAULT_TENANT_NAME || 'default',
}));

@Injectable()
export class ConfigurationService {

    constructor(private readonly configService: ConfigService) { }

    public isProduction(): boolean {
        return this.configService.get<string>('config.env') === 'production';
    }

    public isNotSLS(): boolean {
        return this.configService.get<boolean>('config.isNotSLS') === true;
    }

}
