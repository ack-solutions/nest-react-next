// import { registerAs } from "@nestjs/config";
// import { IDatabaseConfig } from "../../../../../libs/nest-core/src/lib/types/database-config";
// import { DatabaseType } from "typeorm";


// export default registerAs<IDatabaseConfig>('database', () => ({

//     sslMode: process.env.DATABASE_SSL_MODE && process.env.DATABASE_SSL_MODE !== 'false' ? true : false,
//     sslCaPath: process.env.DATABASE_SSL_CA_PATH || '',
//     type: (process.env.DATABASE_TYPE || 'postgres') as DatabaseType,
//     host: process.env.DATABASE_HOST ? process.env.DATABASE_HOST : 'localhost',
//     username: process.env.DATABASE_USERNAME ? process.env.DATABASE_USERNAME : 'postgres',
//     password: process.env.DATABASE_PASSWORD || 'root',
//     name: process.env.DATABASE_NAME || 'next-core',
//     port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
// }));
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { TlsOptions } from 'tls';
import { CustomNamingStrategy, IDatabaseConfig } from '@mlm/nest-core';


@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {


    constructor(
        private configService: ConfigService,
        // private pluginService: PluginService,

    ) { }

    async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {

        const appConfig = this.configService.get('app');
        const database = this.configService.get<IDatabaseConfig>('database');

        // const entities = this.pluginService.getEntities();
        const options = {
            type: database?.type,
            ssl: database?.sslMode ? {
                rejectUnauthorized: true,
                ca: readFileSync(resolve(database?.sslCaPath)).toString()
            } as TlsOptions : false,
            host: database?.host,
            username: database?.username,
            password: database?.password,
            database: database?.name,
            port: database?.port,
            // entities: entities,
            synchronize: true,
            logging: !appConfig?.isProd,
            logger: 'file',
            uuidExtension: 'pgcrypto',
            namingStrategy: new CustomNamingStrategy()
        } as TypeOrmModuleOptions;

        return options;
    }

}
