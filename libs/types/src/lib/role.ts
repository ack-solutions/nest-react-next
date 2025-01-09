
// import { IOrganizationBaseEntity } from './base-entity';
import { IBaseEntity } from './base-entity';
import { IPermission } from './permission';
import { IUser } from './user';


export interface IRole extends IBaseEntity  {
    name?: RoleNameEnum | string;
    isSystemRole?: boolean;
    permissions?: IPermission[];
    users?: IUser;
}

export enum RoleNameEnum {
    ADMIN = 'Admin',
    MANGER = 'Manger',
    USER = 'User',
}

export enum RoleGuardEnum {
    ADMIN = 'Admin',
    WEB = 'web',
}
