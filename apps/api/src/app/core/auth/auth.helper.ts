import { JWTTokenPayload, NestAuthUser, RequestContext } from '@ackplus/nest-auth';
import { RoleGuardEnum, RoleNameEnum } from '@libs/types';
import { User } from '../../modules/user/user.entity';


/**
 * Minimal request shape for property context (set by PropertyGuard).
 * Use getCurrentPropertyId(request) / getCurrentProperty(request) when inside an HTTP handler that uses PropertyGuard.
 */
export interface PropertyContext {
    propertyId: string;
    property: any;
}

export interface RequestWithPropertyContext {
    propertyContext?: PropertyContext;
}

/**
 * Static helper for current user, property, and role checks.
 * Uses RequestContext (session/token) and optional request for property context.
 */
export class AuthHelper {

    /**
     * Current HTTP request (when in request scope).
     */
    static getCurrentRequest(): RequestWithPropertyContext | null {
        return RequestContext.currentRequest() as RequestWithPropertyContext | null;
    }

    /**
     * JWT token payload (current user from token).
     * Includes: sub, id, email, roles, tenantId, etc.
     */
    static getTokenPayload(): JWTTokenPayload | null {
        return RequestContext.getJwtTokenPayload();
    }

    /**
     * Alias for getTokenPayload for compatibility.
     */
    static async getAppUser(relations?: string[]): Promise<User | null> {
        const authUserId = AuthHelper.getAuthUserId();
        if (authUserId) {
            return await User.findOne({
                where: { authUserId },
                relations,
            });
        }
        return null;
    }
    /**
     * Alias for getTokenPayload for compatibility.
     */
    static getAuthUser(): Promise<NestAuthUser | null> {
        const authUserId = AuthHelper.getAuthUserId();
        if (authUserId) {
            return NestAuthUser.findOne({
                where: { id: authUserId },
            });
        }
        return null;
    }

    /**
     * Auth user id (sub or id from token).
     */
    static getAuthUserId(): string | null {
        const payload = AuthHelper.getTokenPayload();
        return payload?.sub ?? payload?.id ?? null;
    }

    /**
     * Tenant ID from the current session/token.
     * Set after property switch in portal.
     */
    static getTenantId(): string | null {
        return RequestContext.currentTenantId() ?? null;
    }

    /**
     * True if the current user has the admin guard (admin app / admin panel).
     */
    static isAdmin(): boolean {
        const payload = AuthHelper.getTokenPayload();
        return !!payload?.roles?.some((role: any) => role?.guard === RoleGuardEnum.ADMIN);
    }

    /**
     * True if the current user has the super_admin role name.
     */
    static isSuperAdmin(): boolean {
        const payload = AuthHelper.getTokenPayload();
        return !!payload?.roles?.some(
            (role: any) => role?.name === RoleNameEnum.SUPER_ADMIN,
        );
    }

    /**
     * True if the current user has the portal guard (portal app, not admin panel).
     */
    static isUser(): boolean {
        const payload = AuthHelper.getTokenPayload();
        if (!payload) return false;
        return payload.roles?.some(
            (role: any) => role?.guard === RoleGuardEnum.WEB,
        );
    }

    /**
     * True if the current user has the given role name.
     */
    static hasRole(roleName: RoleNameEnum | string): boolean {
        const payload = AuthHelper.getTokenPayload();
        return !!payload?.roles?.some((role: any) => role?.name === roleName);
    }

    /**
     * True if the current user has a role with the given guard.
     */
    static hasGuard(guard: RoleGuardEnum | string): boolean {
        const payload = AuthHelper.getTokenPayload();
        return !!payload?.roles?.some((role: any) => role?.guard === guard);
    }

    /**
     * True if the current user is authenticated (has token payload).
     */
    static isAuthenticated(): boolean {
        return !!AuthHelper.getTokenPayload();
    }

}
