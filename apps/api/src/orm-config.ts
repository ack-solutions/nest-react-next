import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { ALL_ENTITIES } from './app/entities';
import { CustomNamingStrategy } from './app/core/typeorm/custom-naming-strategy';
import { readFileSync } from 'fs';
import { resolve } from 'path';

dotenv.config();

const isTestEnv = process.env.NODE_ENV === 'test';
const isSslMode = process.env.DATABASE_SSL_MODE;
const sslCaPath = process.env.DATABASE_SSL_CA_PATH;

let sslOptions: any = false;
if (isSslMode) {
    sslOptions = {
        rejectUnauthorized: false,
    };

    if (sslCaPath && resolve(sslCaPath)) {
        try {
            sslOptions.ca = readFileSync(resolve(sslCaPath)).toString();
        } catch (error) {
            console.warn('Failed to load SSL CA certificate:', error);
        }
    }
}

export const dataSourceOptions: DataSourceOptions = {
    type: (process.env.DATABASE_TYPE || 'postgres') as any,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: isTestEnv ? `${process.env.DATABASE_NAME}_test` : process.env.DATABASE_NAME,
    entities: ALL_ENTITIES,
    uuidExtension: 'pgcrypto',
    synchronize: false,
    logging: false,
    logger: 'formatted-console',
    migrations: [__dirname + '/migrations/*.{ts,js}'],
    namingStrategy: new CustomNamingStrategy(),
    extra: {
        sslmode: process.env.DATABASE_SSL_MODE,
        ...(isSslMode && { ssl: sslOptions }),
    },
    ...(isSslMode && { ssl: sslOptions }),
};

export default new DataSource(dataSourceOptions);
