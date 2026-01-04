import { AuthModuleOptions, AuthModuleOptionsFactory, DebugLogLevel, MFAMethodEnum } from '@ackplus/nest-auth';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfigService implements AuthModuleOptionsFactory {

    constructor(
        private configService: ConfigService,
    ) { }

    createAuthModuleOptions(): Promise<AuthModuleOptions> | AuthModuleOptions {
        return {
            appName: this.configService.get('app').appName,
            accessTokenType: 'header',
            jwt: {
                secret: this.configService.get('jwt.secret'),
            },
            debug: {
                enabled: true,
                level: DebugLogLevel.VERBOSE,
            },
            emailAuth: {
                enabled: true,
            },
            registration: {
                enabled: false,
                requireInvitation: false,
            },
            mfa: {
                enabled: true,
                required: true,
                allowMethodSelection: true,
                methods: [MFAMethodEnum.EMAIL, MFAMethodEnum.SMS],
            },
            defaultTenant: {
                name: this.configService.get('app').defaultTenantName,
                slug: this.configService.get('app').defaultTenantName,
            },
            cookieOptions: {
                secure: process.env.APP_ENV === 'prod',
                // httpOnly: true,
            },
            adminConsole: {
                enabled: true,
                secretKey: this.configService.get('app.adminSecretKey'),
            }
        };
    }

}
