import type { NestAuthRole } from '@ackplus/nest-auth';


export interface IRole extends NestAuthRole {

}

export enum RoleNameEnum {
    ADMIN = 'admin',
    MANAGER = 'manager',
    SUPER_ADMIN = 'super_admin',
    // not a system role
    USER = 'user',
}
export enum RoleGuardEnum {
    ADMIN = 'admin',
    WEB = 'web',
}


export interface IRoleGetInput {
    guard?: string;
    tenantId?: string;
    onlyTenantRoles?: boolean;
    onlySystemRoles?: boolean;
}
