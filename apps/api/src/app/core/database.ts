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
import { entities } from './core-entities';


@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService,) { }
    
    async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
        let options: any;


        const dbType = process.env.DATABASE_TYPE || 'postgres';


        if (dbType == 'postgres') {
            const allEntities = entities;

            const isSSL = process.env.DATABASE_SSL_MODE && process.env.DATABASE_SSL_MODE !== 'false';

            let sslParams: TlsOptions;

            if (isSSL) {
                sslParams = {
                    rejectUnauthorized: false,
                    // ca: readFileSync(join(__dirname, "assets", "ca-certificate.crt")).toString()
                }
            }

            options = {
                ssl: isSSL ? sslParams : false,
                type: dbType,
                host: process.env.DATABASE_HOST || 'localhost',
                username: process.env.DATABASE_USER || 'postgres',
                password: process.env.DATABASE_PASSWORD || 'root',
                database: process.env.DATABASE_NAME,
                port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
                entities: allEntities,
                synchronize: false,
                logging: true,
                logger: 'file', //Removes console logging, instead logs all queries in a file ormlogs.log
                uuidExtension: 'pgcrypto',
            } as TypeOrmModuleOptions;

            console.log("database config", options);

            console.log('DB Type configured: ' + dbType);

        } else {
            throw new Error(`Critical: DB of type ${dbType} not supported yet`);
        }

        return options;
    }

}
