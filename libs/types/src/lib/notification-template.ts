import { IBaseEntity } from "./base-entity";

export interface INotificationTemplate extends IBaseEntity {
    title?: string;
    emailSubject?: string;
    emailBody?: string;
    slug?: string;
    event?: string;
}