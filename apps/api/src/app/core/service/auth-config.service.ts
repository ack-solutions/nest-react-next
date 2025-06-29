import { AuthModuleOptions, AuthModuleOptionsFactory } from '@ackplus/nest-auth';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthConfigService implements AuthModuleOptionsFactory {

    constructor(
        private configService: ConfigService,
    ) { }

    createAuthModuleOptions(): Promise<AuthModuleOptions> | AuthModuleOptions {
        return {
            accessTokenType: 'header',
            jwt: {
                secret: this.configService.get('jwt.secret'),
            },
            emailAuth: {
                enabled: true,
            },
            cookieOptions: {
                secure: process.env.APP_ENV === 'prod',
                // httpOnly: true,
            },
        };
    }

}
