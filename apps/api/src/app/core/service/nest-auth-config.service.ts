import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestAuthUser, IAuthModuleOptions, IAuthModuleOptionsFactory, NestAuthMFAMethodEnum, ERROR_CODES } from '@ackplus/nest-auth';
import { IAppConfig } from "../../config/app";
import { DebugLogLevel } from '@ackplus/nest-auth';
import { RoleGuardEnum, RoleNameEnum } from '@libs/types';

@Injectable()
export class NestAuthConfigService implements IAuthModuleOptionsFactory {
    constructor(
        private readonly configService: ConfigService,
    ) { }

    /**
     * Get guard from request origin/headers
     */
    private getGuardFromRequest(request: any): RoleGuardEnum | null {
        if (!request) return null;

        // Get origin from headers (prefer origin, then extract from referer)
        let origin = request.headers?.origin;

        // If no origin, try to extract from referer
        if (!origin && request.headers?.referer) {
            try {
                const refererUrl = new URL(request.headers.referer);
                origin = refererUrl.origin;
            } catch (e) {
                // If referer is not a valid URL, use it as is
                origin = request.headers.referer;
            }
        }
        // Check for mobile app header (can be x-platform, x-app-platform, or x-client-type)
        const platform = request.headers?.['x-platform'] || request.headers?.['X-Platform']
        if (!origin && (platform === 'mobile' || platform === 'app')) {
            // Mobile app can use either guard, but we'll default to WEB
            // You can customize this logic based on your needs
            // For mobile, you might want to check a specific header for guard preference
            const mobileGuard = request.headers?.['x-mobile-guard'] || request.headers?.['X-Mobile-Guard'];
            if (mobileGuard === RoleGuardEnum.ADMIN || mobileGuard === RoleGuardEnum.WEB) {
                return mobileGuard as RoleGuardEnum;
            }
            return RoleGuardEnum.WEB;
        }

        if (!origin) return null;

        const frontUrl = this.configService.get<string>('FRONT_URL');
        const adminUrl = this.configService.get<string>('ADMIN_URL');

        // Normalize URLs for comparison (remove protocol, trailing slashes, www)
        const normalizeUrl = (url: string) => {
            if (!url) return '';
            return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '').toLowerCase();
        };

        const normalizedOrigin = normalizeUrl(origin);
        const normalizedFrontUrl = normalizeUrl(frontUrl || '');
        const normalizedAdminUrl = normalizeUrl(adminUrl || '');

        // Check admin URL first (more specific match should be checked first)
        // This prevents cases where admin.dev.badacup.com matches dev.badacup.com first
        if (normalizedAdminUrl) {
            // Exact match
            if (normalizedOrigin === normalizedAdminUrl) {
                console.log('return admin (exact match)');
                return RoleGuardEnum.ADMIN;
            }
            // Substring match (for cases like ports or paths, though normalized shouldn't have them)
            if (normalizedOrigin.includes(normalizedAdminUrl)) {
                console.log('return admin (substring match)');
                return RoleGuardEnum.ADMIN;
            }
        }

        // Check front URL only if admin didn't match
        if (normalizedFrontUrl) {
            // Exact match
            if (normalizedOrigin === normalizedFrontUrl) {
                console.log('return web (exact match)');
                return RoleGuardEnum.WEB;
            }
            // Substring match
            if (normalizedOrigin.includes(normalizedFrontUrl)) {
                console.log('return web (substring match)');
                return RoleGuardEnum.WEB;
            }
        }

        return null;
    }

    /**
     * Validate user has roles with the specified guard
     */
    private async validateUserGuard(user: NestAuthUser, requiredGuard: RoleGuardEnum): Promise<boolean> {
        // Reload user with roles if not already loaded
        if (!user.roles || user.roles.length === 0) {
            const userWithRoles = await NestAuthUser.findOne({
                where: { id: user.id },
                relations: ['roles']
            });
            if (!userWithRoles) return false;
            return userWithRoles.roles.some((role: any) => role.guard === requiredGuard);
        }

        return user.roles.some((role: any) => role.guard === requiredGuard);
    }

    createAuthModuleOptions(): IAuthModuleOptions {
        const config: IAuthModuleOptions = {
            appName: process.env.APP_NAME || 'Template',
            jwt: {
                secret: this.configService.getOrThrow<string>('jwt.secret'),
                accessTokenExpiresIn: this.configService.get<string>('jwt.expiresIn'),
                refreshTokenExpiresIn: this.configService.get<string>('jwt.expiresIn'),
            },
            defaultTenant: {
                name: process.env.APP_NAME || 'Template',
                slug: this.configService.get<IAppConfig>('app')?.defaultTenantName,
            },
            mfa: {
                enabled: false,
                required: false,
                methods: [NestAuthMFAMethodEnum.EMAIL],
                otpLength: 6,
                otpExpiresIn: '15m',
                defaultOtp: this.configService.get('env') !== 'prod' ? '123456' : undefined,
            },
            // google: {
            //     clientId: this.configService.getOrThrow<string>('sso.google.clientId'),
            //     clientSecret: this.configService.getOrThrow<string>('sso.google.clientSecret'),
            //     redirectUri: this.configService.getOrThrow<string>('sso.google.redirectUri'),
            // },
            // facebook: {
            //     appId: this.configService.getOrThrow<string>('sso.facebook.appId'),
            //     appSecret: this.configService.getOrThrow<string>('sso.facebook.appSecret'),
            //     redirectUri: this.configService.getOrThrow<string>('sso.facebook.oauthRedirectUri'),
            // },
            adminConsole: {
                enabled: true,
                secretKey: this.configService.get<string>('nest_auth.adminUIsecretKey'),
            },
            debug: {
                enabled: false,
                level: DebugLogLevel.VERBOSE,
                useConsole: true,
            } as any,
            session: {
                storageType: 'database' as any,
                sessionExpiry: '30d'
            },
            cookieOptions: {
                domain: process.env.COOKIES_DOMAIN,
                httpOnly: true,
                secure: process.env.APP_ENV !== 'local',
                sameSite: process.env.APP_ENV !== 'local' ? 'none' : 'lax',
            },
            registrationHooks: {
                beforeSignup: async (input: any, context: { request: any }) => {
                    const request = context?.request;
                    const guardFromInput = input?.guard as RoleGuardEnum;
                    const guardFromOrigin = this.getGuardFromRequest(request);

                    // Validate origin matches guard
                    if (guardFromOrigin) {
                        if (guardFromInput && guardFromInput !== guardFromOrigin) {
                            throw new BadRequestException(
                                `Guard mismatch: Request origin requires "${guardFromOrigin}" guard, but "${guardFromInput}" was provided.`
                            );
                        }
                    }

                    // // Validate referral code if provided
                    // if (input?.referralCode) {
                    //     const normalizedCode = normalizeReferralCode(input.referralCode);
                    //     // Import User entity dynamically to avoid circular dependency
                    //     const { User } = await import('../../modules/user/user.entity');

                    //     const referrer = await User.findOne({
                    //         where: { referralCode: normalizedCode },
                    //         select: ['id', 'referralCode'],
                    //     });

                    //     if (!referrer) {
                    //         throw new BadRequestException('Invalid referral code. Please check and try again.');
                    //     }
                    // }
                    return input;
                },
                onSignup: async (user: NestAuthUser, input: any, context?: { request?: any }) => {
                    // Reload user to ensure we have the latest data
                    const latestAuthUser = await NestAuthUser.findOne({
                        where: { id: user.id }
                    });
                    if (!latestAuthUser) {
                        throw new Error(`Auth user not found: ${user.id}`);
                    }

                    // Assign role with the determined guard
                    await latestAuthUser.assignRoles([RoleNameEnum.USER], input?.guard || RoleGuardEnum.WEB);
                    await latestAuthUser.save();
                }
            },
            loginHooks: {
                onLogin: async (user: NestAuthUser, input: any, context?: { request?: any; provider?: any }) => {
                    const request = context?.request;
                    const guardFromInput = input?.guard as RoleGuardEnum;
                    const guardFromOrigin = this.getGuardFromRequest(request);
                    // Determine required guard (priority: input > origin)
                    const requiredGuard = guardFromInput || guardFromOrigin;

                    if (!requiredGuard) {
                        // If no guard specified, allow login (for backward compatibility or mobile)
                        // But you might want to throw an error here instead
                        return user;
                    }

                    // Validate user has roles with the required guard
                    const hasRequiredGuard = await this.validateUserGuard(user, requiredGuard);

                    if (!hasRequiredGuard) {
                        throw new UnauthorizedException({
                            message: 'Invalid credentials',
                            code: ERROR_CODES.INVALID_CREDENTIALS,
                        });
                    }

                    // Validate origin matches guard if both are present
                    if (guardFromOrigin && guardFromInput && guardFromInput !== guardFromOrigin) {
                        throw new BadRequestException({
                            message: 'Invalid request',
                            code: ERROR_CODES.GUARD_MISMATCH,
                        });
                    }

                    return user;
                }
            },
            user: {
                beforeCreate: async (userData: Partial<NestAuthUser>, input: any) => {
                    return userData;
                },
                async afterCreate(user, input) {
                },
            }
        };
        return config
    }
}
