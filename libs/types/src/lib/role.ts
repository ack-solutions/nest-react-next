import type { Role } from '@ackplus/nest-auth';


export interface IRole extends Role {

}

export enum RoleNameEnum {
    ADMIN = 'Admin',
    MANGER = 'Manger',
    SUPER_ADMIN = 'Super Admin',
}
export enum RoleGuardEnum {
    ADMIN = 'Admin',
    WEB = 'Web',
}


export interface IRoleGetInput {
    withPermissions?: boolean;
}
