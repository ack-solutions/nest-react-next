import { IBaseEntity } from './base-entity';


export interface ICountry extends IBaseEntity {
    country?: string;
    code?: string;
    iso?: string;
}

export interface ICountrySearchInput {
    search?: string;
}
