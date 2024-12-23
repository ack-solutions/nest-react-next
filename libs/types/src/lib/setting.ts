import { IBaseEntity } from "./base-entity";


export interface ISetting extends IBaseEntity {
    name?: string;
    key?: string;
    value?: string;
    type?: SettingTypeEnum;
}

export enum SettingTypeEnum {
    PRIVATE = 'private',
    PUBLIC = 'public',
}

export enum SmtpEncryptionTypeEnum {
    NONE = 'none',
    SSL = 'ssl',
    TLS = 'tls',
    AUTO = 'auto'
}
