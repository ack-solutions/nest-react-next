import { IBaseEntity } from './base-entity';

export interface IPage extends IBaseEntity {
    title?: string;
    slug?: string;
    content?: string;
    name?: string;
    status?: PageStatusEnum;
}

export enum PageStatusEnum {
    DRAFT = 'draft',
}
