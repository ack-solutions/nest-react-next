import { DatabaseType } from "typeorm";

export interface IDatabaseConfig {
    sslMode: boolean;
    sslCaPath: string;
    type: DatabaseType;
    host: string;
    username: string;
    password: string;
    name: string;
    port?: number;
}