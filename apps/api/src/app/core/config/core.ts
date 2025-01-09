import { Injectable } from "@nestjs/common";
import { ConfigService, registerAs } from "@nestjs/config";


export default registerAs('core', () => ({
    env: process.env.APP_ENV || 'dev',
    apiUrl: process.env.API_URL || '',
    frontUrl: process.env.APP_FRONT_URL || '',
    adminUrl: process.env.APP_ADMIN_URL || '',
    appKey: process.env.APP_KEY || '',
    port: parseInt(process.env.PORT, 10) || 3333,
}));


@Injectable()
export class ConfigurationService {
    constructor(private readonly configService: ConfigService) { }

    public isProduction(): boolean {
        return this.configService.get<string>('config.env') == 'production';
    }

    public isNotSLS(): boolean {
        return this.configService.get<boolean>('config.isNotSLS') == true;
    }
}