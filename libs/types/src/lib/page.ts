import { IBaseEntity } from './base-entity';


export interface IPage extends IBaseEntity {
    title?: string;
    slug?: string;
    content?: string;
    status?: PageStatusEnum;
    metaData?: IMeta;
    name?: string;
}

export interface IMeta {
    pageTitle: string;
    meta?: IMetaValue[];
}

export interface IMetaValue {
    key: string;
    value?: string;
}

export enum PageStatusEnum {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    UNPUBLISHED = 'unpublished',
}
