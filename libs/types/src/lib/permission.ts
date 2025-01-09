import { IBaseEntity } from './base-entity';
import { IRole } from './role';


export interface IPermission extends IBaseEntity {
    roles?: IRole[];
    name?: string;
}
