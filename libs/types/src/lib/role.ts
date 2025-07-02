import type { Role } from '@ackplus/nest-auth';


export interface IRole extends Role {

}

export enum RoleNameEnum {
    ADMIN = 'admin',
    MANAGER = 'manager',
    SUPER_ADMIN = 'super_admin',
}
export enum RoleGuardEnum {
    ADMIN = 'admin',
    WEB = 'web',
}


export interface IRoleGetInput {
    withPermissions?: boolean;
}
