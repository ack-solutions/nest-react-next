import { IBaseEntity } from './base-entity';

export interface IPage extends IBaseEntity {
    title?: string;
    slug?: string;
    content?: string;
    status?: PageStatusEnum;
    metaData?: any;
    name?: string;
}

export enum PageStatusEnum {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    UNPUBLISHED = 'unpublished',
}
