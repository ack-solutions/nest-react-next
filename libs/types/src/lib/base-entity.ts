// import { IOrganization } from "./organization";

export interface IBaseEntity {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

// export interface IOrganizationBaseEntity extends IBaseEntity {
//     organizationId?: string;
//     organization?:IOrganization
// }