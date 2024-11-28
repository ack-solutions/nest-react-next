import { IBaseEntity } from "./base-entity";

export interface IPage extends IBaseEntity {
    name?: string;
    title?: string;
    slug?: string;
    key?: string;
    value?: string;
    content?: string;
    template?: string;
}

export enum PageTemplateEnum {
    DEFAULT = 'default',
}