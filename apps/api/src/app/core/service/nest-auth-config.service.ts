import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestAuthUser, IAuthModuleOptions, IAuthModuleOptionsFactory, NestAuthMFAMethodEnum, ERROR_CODES, TenantModeEnum, NestAuthUserAccess, INestAuthRole } from '@ackplus/nest-auth';
import { IAppConfig } from "../../config/app";
import { DebugLogLevel } from '@ackplus/nest-auth';
import { RoleGuardEnum, RoleNameEnum } from '@libs/types';
import { INestAuthEnvConfig } from '../../config/nest_auth';

@Injectable()
export class NestAuthConfigService implements IAuthModuleOptionsFactory {
    constructor(
        private readonly configService: ConfigService,
    ) { }

    createAuthModuleOptions(): IAuthModuleOptions {
        const authConfig = this.configService.get<INestAuthEnvConfig>('nest_auth');

        const config: IAuthModuleOptions = {
            appName: process.env.APP_NAME || 'Template',
            roleGuards: [RoleGuardEnum.ADMIN, RoleGuardEnum.WEB],
            tenant: {
                enabled: false,
                mode: TenantModeEnum.SHARED,
            },
            mfa: {
                enabled: true,
                required: false,
                methods: [NestAuthMFAMethodEnum.EMAIL, NestAuthMFAMethodEnum.TOTP, NestAuthMFAMethodEnum.SMS],
                trustedDeviceSecret: authConfig.trustedDevicesSecret,
            },
            otp: {
                length: 6,
                format: 'numeric',
                codeExpiresIn: '15m',
            },
            emailAuth: {
                enabled: true,
            },
            phoneAuth: {
                enabled: true,
            },
            passwordless: {
                enabled: true,
                allowSignUp: true,
            },
            adminConsole: {
                enabled: true,
                secretKey: authConfig.adminUIsecretKey,
            },
            debug: {
                enabled: false,
                level: DebugLogLevel.VERBOSE,
                useConsole: true,
            } as any,
            session: {
                storageType: 'database' as any,
                accessTokenValidity: '1h',
                refreshTokenValidity: '30d',
                jwt: {
                    secret: authConfig.jwtSecret,
                },
                cookieOptions: {
                    domain: authConfig.cookiesDomain,
                    httpOnly: true,
                    secure: process.env.APP_ENV !== 'local',
                    sameSite: process.env.APP_ENV !== 'local' ? 'none' : 'lax',
                },
            },
            registrationHooks: {
                beforeSignup: async (input: any, context?: { request?: any }) => {
                    const requestGuard = this.resolveGuardFromRequest(context?.request);
                    const inputGuard = this.parseGuard(input?.guard);

                    this.validateGuardConsistency({
                        requestGuard,
                        inputGuard,
                        allowMissing: true,
                    });

                    return input;
                },

                onSignup: async (user: NestAuthUser, input: any) => {
                    const latestAuthUser = await NestAuthUser.findOne({
                        where: { id: user.id }
                    });
                    if (!latestAuthUser) {
                        throw new Error(`Auth user not found: ${user.id}`);
                    }
                    // Assign role with the determined guard
                    await latestAuthUser.assignRoles([RoleNameEnum.USER], input?.guard || RoleGuardEnum.WEB);
                    await latestAuthUser.save();
                },
            },
            loginHooks: {
                onLogin: async (
                    user: NestAuthUser,
                    input: any,
                    context?: { request?: any; provider?: any },
                ) => {
                    const requestGuard = this.resolveGuardFromRequest(context?.request);
                    const inputGuard = this.parseGuard(input?.guard);

                    this.validateGuardConsistency({
                        requestGuard,
                        inputGuard,
                        allowMissing: false,
                    });

                    const requiredGuard = inputGuard ?? requestGuard;
                    if (!requiredGuard) {
                        throw new UnauthorizedException({
                            message: 'Login requires a valid guard.',
                            code: ERROR_CODES.INVALID_CREDENTIALS,
                        });
                    }

                    const hasAccess = await this.userHasGuardAccess(user, requiredGuard);
                    if (!hasAccess) {
                        throw new UnauthorizedException({
                            message: 'Invalid credentials',
                            code: ERROR_CODES.INVALID_CREDENTIALS,
                        });
                    }

                    return user;
                },
            },

            user: {
                beforeCreate: async (userData: Partial<NestAuthUser>) => userData,
                afterCreate: async () => { },
            },
        };

        return config;
    }

    private parseGuard(value?: unknown): RoleGuardEnum | null {
        if (!value || typeof value !== 'string') {
            return null;
        }

        return Object.values(RoleGuardEnum).includes(value as RoleGuardEnum)
            ? (value as RoleGuardEnum)
            : null;
    }

    private resolveGuardFromRequest(request?: any): RoleGuardEnum | null {
        if (!request) {
            return null;
        }

        const mobileGuard = this.resolveMobileGuard(request);
        if (mobileGuard) {
            return mobileGuard;
        }

        const origin = this.extractRequestOrigin(request);
        if (!origin) {
            return null;
        }

        const normalizedOrigin = this.normalizeUrl(origin);
        const adminUrl = this.normalizeUrl(this.configService.get<string>('ADMIN_URL'));
        const frontUrl = this.normalizeUrl(this.configService.get<string>('FRONT_URL'));

        if (adminUrl && normalizedOrigin.includes(adminUrl)) {
            return RoleGuardEnum.ADMIN;
        }

        if (frontUrl && normalizedOrigin.includes(frontUrl)) {
            return RoleGuardEnum.WEB;
        }

        return null;
    }

    private resolveMobileGuard(request?: any): RoleGuardEnum | null {
        const platform =
            request?.headers?.['x-platform'] ??
            request?.headers?.['X-Platform'] ??
            request?.headers?.['x-app-platform'] ??
            request?.headers?.['x-client-type'];

        if (platform !== 'mobile' && platform !== 'app') {
            return null;
        }

        const mobileGuard =
            request?.headers?.['x-mobile-guard'] ??
            request?.headers?.['X-Mobile-Guard'];

        const parsedGuard = this.parseGuard(mobileGuard);
        return parsedGuard ?? RoleGuardEnum.WEB;
    }

    private extractRequestOrigin(request?: any): string | null {
        const origin = request?.headers?.origin;
        if (origin) {
            return origin;
        }

        const referer = request?.headers?.referer;
        if (!referer) {
            return null;
        }

        try {
            return new URL(referer).origin;
        } catch {
            return referer;
        }
    }

    private normalizeUrl(value?: string): string {
        if (!value) {
            return '';
        }

        return value
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '')
            .replace(/\/$/, '')
            .toLowerCase();
    }

    private validateGuardConsistency(params: {
        requestGuard: RoleGuardEnum | null;
        inputGuard: RoleGuardEnum | null;
        allowMissing: boolean;
    }): void {
        const { requestGuard, inputGuard, allowMissing } = params;

        if (requestGuard && inputGuard && requestGuard !== inputGuard) {
            throw new BadRequestException({
                message: 'Invalid request',
                code: ERROR_CODES.GUARD_MISMATCH,
            });
        }

        if (!allowMissing && !requestGuard && !inputGuard) {
            throw new UnauthorizedException({
                message: 'Login requires a valid guard.',
                code: ERROR_CODES.INVALID_CREDENTIALS,
            });
        }
    }

    private async userHasGuardAccess(
        user: NestAuthUser,
        requiredGuard: RoleGuardEnum,
    ): Promise<boolean> {
        const roles =
            user?.userAccesses?.flatMap((access: any) => access?.roles ?? []) ?? [];

        if (roles.length > 0) {
            return roles.some(
                (role: Partial<INestAuthRole>) => role.guard === requiredGuard,
            );
        }

        const access = await NestAuthUserAccess.findOne({
            where: {
                userId: user.id,
                roles: {
                    guard: requiredGuard,
                },
            },
        });

        return !!access;
    }
}
