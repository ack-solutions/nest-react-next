import { IDatabaseConfig } from "@libs/nest-core";
import { registerAs } from "@nestjs/config";
import { DatabaseType } from "typeorm";

export default registerAs<IDatabaseConfig>('database', () => ({
    sslMode: process.env.DATABASE_SSL_MODE && process.env.DATABASE_SSL_MODE !== 'false',
    sslCaPath: process.env.DATABASE_SSL_CA_PATH,
    type: (process.env.DATABASE_TYPE || 'postgres') as DatabaseType,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    port: parseInt(process.env.DATABASE_PORT) || 5432,
}));